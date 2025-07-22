import admin from "@/lib/firebaseAdmin";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  let data;

  // Get the request's json data and if not possible return an error
  try {
    data = await request.json();
  } catch {
    return new Response("No JSON body provided");
  }

  // Check if the data has the required format and return an error if not
  if (
    data.path === undefined ||
    data.id === undefined ||
    typeof data.path !== "string" ||
    typeof data.id !== "string"
  ) {
    return new Response("Invalid data format");
  }

  // Get the tasks from the database
  const taskData = await admin.database().ref(data.path).get();

  // Update the data in the path in the database to empty to delete it
  admin
    .database()
    .ref(data.path)
    .update({
      tasks: taskData
        .val()
        .tasks.filter((task: { id: string }) => task.id !== data.id),
    });

  return new Response("Task deleted successfully");
}
