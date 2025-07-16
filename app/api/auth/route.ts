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
  const { username } = await request.json();
  if (!username) {
    return new Response("No new username name provided", { status: 400 });
  }

  // Update the user's display name in Firebase Auth
  await admin.auth().updateUser(userId, { displayName: username });

  // Update the user's display name in Firestore
  admin
    .firestore()
    .collection("Users")
    .doc(userId)
    .update({ username: username });

  return new Response("Display name updated", { status: 200 });
}
