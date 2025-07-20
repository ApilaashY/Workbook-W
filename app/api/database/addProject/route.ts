import { ProjectObject } from "@/lib/DataClasses/ProjectClass";
import { db } from "@/lib/firebase";
import admin from "@/lib/firebaseAdmin";
import { DecodedIdToken } from "firebase-admin/auth";
import { ref, set } from "firebase/database";
import { NextRequest } from "next/server";

const maxProjects = 2; // Max number of a projects a user can have

export async function POST(request: NextRequest) {
  // Get the request's authorzation and return if not present
  // const authHeader = request.headers.get("authorization");
  // if (!authHeader) return new Response("Unauthorized", { status: 401 });

  // console.log(authHeader);

  // // Verify the token and get the user ID
  // const token = authHeader.split(" ")[1];
  // let decoded: DecodedIdToken;
  // try {
  //   decoded = await admin.auth().verifyIdToken(token);
  //   console.log(decoded);
  // } catch {
  //   console.error("Invalid token");
  //   return new Response("Invalid token", { status: 401 });
  // }
  // const userId = decoded.uid;

  // Return if the user is not verified
  // if (!decoded.email_verified) {
  //   return new Response("Email not verified", { status: 403 });
  // }

  // Get new project title from the request body and return if the title is not present
  const { title, userId } = await request.json();
  if (!title) {
    return new Response("Invalid project data", { status: 410 });
  }

  // Get the user's data from Firestore and return if the user does not exist or cannot be retrieved
  const userData = await admin
    .firestore()
    .collection("Users")
    .doc(userId)
    .get();
  if (!userData.exists) {
    return new Response("Error adding project", { status: 500 });
  }

  // Return if the user has reached the maximum number of projects
  if (userData.data()?.projects.length >= maxProjects) {
    return new Response("Error adding project: Maximum projects reached", {
      status: 400,
    });
  }

  // Add the reference for the new project to the user's data in Firestore
  // and increment the project count
  await admin
    .firestore()
    .doc(`Users/${userId}`)
    .update({
      projectCount: (userData.data()?.projectCount || 0) + 1,
      projects: [
        ...(userData.data()?.projects || []),
        userId + "_" + (userData.data()?.projectCount || 0),
      ],
    });

  // Create new project object
  const newProject: ProjectObject = {
    title: title,
    id: (userId ?? "") + "_" + (userData.data()?.projectCount || 0),
  };

  // Add the new project to the Realtime Database
  try {
    await set(ref(db, `projects/${newProject.id}`), newProject);
  } catch (err) {
    console.error("Realtime DB error:", err);

    // If the project can not be added, remove the reference from the user's data in Firestore
    await admin
      .firestore()
      .doc(`Users/${userId}`)
      .update({
        projectCount: userData.data()?.projectCount || 0,
        projects: [...(userData.data()?.projects || [])],
      });

    return new Response("Realtime DB error", { status: 500 });
  }

  // Return the new project ID in the response
  return new Response(
    JSON.stringify({
      projectId: newProject.id,
    }),
    {
      status: 201,
      headers: { "Content-Type": "application/json" },
    }
  );
}
