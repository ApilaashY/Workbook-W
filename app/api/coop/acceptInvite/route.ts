import admin from "@/lib/firebaseAdmin";
import { DecodedIdToken } from "firebase-admin/auth";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  console.log("Adding person to project...");
  // Get the request's authorzation and return if not present
  const authHeader = request.headers.get("authorization");
  if (!authHeader) return new Response("Unauthorized", { status: 401 });

  // Verify the token and get the user ID
  const token = authHeader.split(" ")[1];
  let decoded: DecodedIdToken;
  try {
    decoded = await admin.auth().verifyIdToken(token);
  } catch (tokenError) {
    console.error("Invalid token", tokenError);
    return new Response("Invalid token", { status: 401 });
  }

  // Get email of the user to be added
  const { projectId } = await request.json();

  if (!projectId) {
    return new Response("ProjectId is required", { status: 400 });
  }

  // Get the user data from Firestore
  const userData = await admin
    .firestore()
    .collection("Users")
    .doc(decoded.uid)
    .get();
  if (!userData.exists) {
    return new Response("User not found", { status: 404 });
  }

  // Check if the user is invited to the project
  if (!userData.data()?.invites?.includes(projectId)) {
    return new Response("User not invited to this project", { status: 403 });
  }

  const invites = (userData.data()?.invites || []).filter(
    (id: string) => id !== projectId
  );
  const projects = [...(userData.data()?.projects || []), projectId];

  // Update the user data in Firestore
  await admin.firestore().collection("Users").doc(decoded.uid).update({
    invites: invites,
    projects: projects,
  });

  console.log(decoded);

  // Add the user to the project in Firestore
  await admin
    .database()
    .ref(`projects/${projectId}/people`)
    .update({
      [decoded.uid]: decoded.name || decoded.email || "Unknown User",
    });
  await admin
    .database()
    .ref(`projects/${projectId}/invites`)
    .update({
      [decoded.uid]: null,
    });

  return new Response("Invite accepted", { status: 200 });
}
