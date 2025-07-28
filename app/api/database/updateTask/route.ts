import admin from "@/lib/firebaseAdmin";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  let data;

  // Get the request's json data and if not possible return an error
  try {
    data = await request.json();
  } catch {
    return new Response("No JSON body provided", { status: 400 });
  }

  // Check if the data has the required format and return an error if not
  if (
    data.path === undefined ||
    data.category === undefined ||
    data.data === undefined ||
    typeof data.path !== "string" ||
    typeof data.category !== "string"
  ) {
    return new Response("Invalid data format", { status: 400 });
  }

  // Early path validation to prevent unnecessary database calls
  if (!data.path.startsWith("projects/")) {
    return new Response("Invalid path", { status: 400 });
  }

  // Increment to the data list if the category is a list
  // Updates the value and send it to the database
  if (["tasks"].includes(data.category)) {
    // Use transaction to atomically update without separate read
    await admin
      .database()
      .ref(data.path)
      .transaction((currentData) => {
        if (!currentData) return null; // Abort if path doesn't exist

        const taskCount = (currentData.taskCount || 0) + 1;
        const newTask = {
          title: data.data,
          id: `${currentData.id}-${taskCount}`,
          createdAt: new Date().toISOString(),
        };

        return {
          ...currentData,
          taskCount,
          tasks: [...(currentData.tasks || []), newTask],
        };
      });
  } else {
    await admin
      .database()
      .ref(data.path)
      .update({
        [data.category]: data.data,
      });
  }

  return new Response("Changes Made", { status: 200 });
}
