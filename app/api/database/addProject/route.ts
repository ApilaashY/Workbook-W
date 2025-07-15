import { ProjectObject } from "@/lib/DataClasses/ProjectClass";
import { db } from "@/lib/firebase";
import admin from "@/lib/firebaseAdmin";
import { ref, set } from "firebase/database";
import { NextRequest } from "next/server";

const maxProjects = 2;

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader) return new Response("Unauthorized", { status: 401 });

  const token = authHeader.split(" ")[1];
  let decoded;
  try {
    decoded = await admin.auth().verifyIdToken(token);
  } catch {
    return new Response("Invalid token", { status: 401 });
  }

  const userId = decoded.uid;

  const { title } = await request.json();

  if (!title) {
    return new Response("Invalid project data", { status: 410 });
  }

  let userData = await admin.firestore().collection("Users").doc(userId).get();

  if (!userData.exists) {
    return new Response("Error adding project", { status: 500 });
  }

  if (userData.data()?.projects.length >= maxProjects)
    return new Response("Error adding project: Maximum projects reached", {
      status: 400,
    });

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

  const newProject: ProjectObject = {
    title: title,
    id: (userId ?? "") + "_" + (userData.data()?.projectCount || 0),
  };

  try {
    await set(ref(db, `projects/${newProject.id}`), newProject);
  } catch (err) {
    console.error("Realtime DB error:", err);
    return new Response("Realtime DB error", { status: 500 });
  }

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
