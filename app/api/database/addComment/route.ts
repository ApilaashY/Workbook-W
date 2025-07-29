import admin from "@/lib/firebaseAdmin";
import { DecodedIdToken } from "firebase-admin/auth";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  let data;

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
  const userId = decoded.uid;

  // Get the request's json data and if not possible return an error
  try {
    data = await request.json();
  } catch {
    return new Response("No JSON body provided", { status: 400 });
  }

  // Check if the data has the required format and return an error if not
  const { comment, projectLink } = data;
  console.log(projectLink, comment);
  if (
    comment === undefined ||
    projectLink === undefined ||
    typeof projectLink !== "string"
  ) {
    return new Response("Invalid data format", { status: 400 });
  }

  if (
    (
      await admin
        .database()
        .ref(`projects/${projectLink.split("/")[0]}`)
        .get()
    ).val()[userId] === null
  ) {
    return new Response("You are not a member of this project", {
      status: 403,
    });
  }

  // Add comment to the database
  try {
    await admin
      .database()
      .ref(`comments/${projectLink}/comments`)
      .push(comment);
  } catch (error) {
    console.error("Error adding comment:", error);
    return new Response("Failed to add comment", { status: 500 });
  }

  // Return a success response
  return new Response("Comment added successfully", { status: 201 });
}
