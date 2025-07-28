import admin from "@/lib/firebaseAdmin";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  console.log("Adding person to project...");
  // Get the request's authorzation and return if not present
  const authHeader = request.headers.get("authorization");
  if (!authHeader) return new Response("Unauthorized", { status: 401 });

  // Verify the token and get the user ID
  const token = authHeader.split(" ")[1];
  try {
    await admin.auth().verifyIdToken(token);
  } catch (tokenError) {
    console.error("Invalid token", tokenError);
    return new Response("Invalid token", { status: 401 });
  }

  // Get email of the user to be added
  const { projectId, uid } = await request.json();

  if (!projectId || !uid) {
    return new Response("ProjectId and id are required", { status: 400 });
  }

  // Check if the user is the owner of the project
  if (projectId.split("_")[0] === uid) {
    return new Response("Cannot remove the owner of the project", {
      status: 400,
    });
  }

  // Remove user from the project
  try {
    await admin
      .database()
      .ref(`projects/${projectId}/people`)
      .update({
        [uid]: null,
      });
  } catch (error) {
    console.error("Error removing person from project:", error);
    return new Response("Failed to remove person", { status: 500 });
  }

  console.log("Person removed from project:", uid);

  // Remove user reference from the user's projects
  try {
    const userData = await admin.firestore().collection("Users").doc(uid).get();
    if (userData.exists) {
      const projects = userData.data()?.projects || [];
      await admin
        .firestore()
        .collection("Users")
        .doc(uid)
        .update({
          projects: projects.filter((project: string) => project !== projectId),
        });
    }
  } catch (error) {
    console.error("Error removing user from projects:", error);
    return new Response("Failed to remove user from projects", { status: 500 });
  }

  return new Response("Person removed successfully", { status: 200 });
}
