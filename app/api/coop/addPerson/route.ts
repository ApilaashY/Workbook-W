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
  const { email, projectId } = await request.json();

  if (!email || !projectId) {
    return new Response("Email and projectId are required", { status: 400 });
  }

  // Get user's uid
  const uidData = await admin.auth().getUserByEmail(email);
  if (!uidData) {
    return new Response("User not found", { status: 404 });
  }

  // Check if the user is already part of the project
  const projectRef = await admin
    .firestore()
    .collection("projects")
    .doc(projectId)
    .get();
  if (projectRef.exists) {
    const projectData = projectRef.data();
    if (projectData?.people?.[uidData.uid]) {
      return new Response("User is already part of the project", {
        status: 400,
      });
    }
  } else {
    return new Response("Project not found", { status: 404 });
  }

  const uid = uidData.uid;
  // Send the user an invite to the project
  await admin
    .database()
    .ref(`requests/${uid}`)
    .update({ [projectId]: true });
}
