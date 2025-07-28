import admin from "@/lib/firebaseAdmin";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  console.log("Adding person to project...");
  // Get the request's authorzation and return if not present
  const authHeader = request.headers.get("authorization");
  if (!authHeader) return new Response("Unauthorized", { status: 401 });

  // Verify the token and get the user ID
  const token = authHeader.split(" ")[1];
  // let decoded: DecodedIdToken;
  try {
    await admin.auth().verifyIdToken(token);
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
  console.log("User data:", uidData);

  // Get the user's data
  const userData = await admin
    .firestore()
    .collection("Users")
    .doc(uidData.uid)
    .get();

  console.log("User data:", userData.data());

  if (!userData.exists) {
    return new Response("User data not found", { status: 404 });
  }

  const projectList = userData.data()?.projects || [];
  const inviteList = userData.data()?.invites || [];

  // Check if the user is already part of the project
  if (projectList.includes(projectId)) {
    return new Response("User is already part of the project", { status: 400 });
  }

  // Check if the user has already been invited to the project
  if (inviteList.includes(projectId)) {
    return new Response("User has already been invited to the project", {
      status: 400,
    });
  }

  // Add the project to the user's invites and update the user's data
  await admin
    .firestore()
    .collection("Users")
    .doc(uidData.uid)
    .update({ invites: [...inviteList, projectId] });

  // Add the invite to the requests in the project database
  await admin
    .database()
    .ref(`projects/${projectId}/invites`)
    .update({
      [uidData.uid]: uidData.email,
    });

  return new Response("Invite sent successfully", { status: 200 });
}
