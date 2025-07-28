import admin from "@/lib/firebaseAdmin";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  // Get the request's authorzation and return if not present
  const authHeader = request.headers.get("authorization");
  if (!authHeader) return new Response("Unauthorized", { status: 401 });

  // Verify the token and get the user ID
  const token = authHeader.split(" ")[1];
  let decoded;
  try {
    decoded = await admin.auth().verifyIdToken(token);
  } catch {
    return new Response("Invalid token", { status: 401 });
  }
  const userId = decoded.uid;

  // Get new username name from request body
  const { username, oldUsername } = await request.json();
  if (!username || !oldUsername) {
    return new Response("No new username or old username provided", {
      status: 400,
    });
  }

  // Update the user's display name in Firebase Auth
  try {
    await admin.auth().updateUser(userId, { displayName: username });
  } catch {
    return new Response("Failed to update display name", { status: 500 });
  }

  console.log("Name: " + username);

  // Update the user's display name in Firestore
  try {
    await admin
      .firestore()
      .collection("Users")
      .doc(userId)
      .update({ username: username });

    const data = await admin.firestore().collection("Users").doc(userId).get();
    for (const project in data.data()?.projects ?? []) {
      await admin
        .database()
        .ref(`projects/${project}/people`)
        .update({ [userId]: username });
    }
  } catch {
    await admin.auth().updateUser(userId, { displayName: oldUsername });

    return new Response("Failed to update username in Firestore", {
      status: 500,
    });
  }

  return new Response("Display name updated", { status: 200 });
}
