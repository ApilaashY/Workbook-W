import { TaskObject } from "@/lib/DataClasses/TaskClass";
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
  try {
    if (["tasks", "comments"].includes(data.category)) {
      // Use transaction for atomic updates - eliminates race conditions and reduces network calls
      await admin
        .database()
        .ref(data.path)
        .transaction((currentData) => {
          if (!currentData) return null; // Abort transaction if path doesn't exist

          // Ensure the category array exists
          const existingList = Array.isArray(currentData[data.category])
            ? currentData[data.category]
            : [];

          const updatedData = {
            ...currentData,
            [data.category]: [...existingList, data.data],
          };

          // Handle task-specific logic
          if (data.category === "tasks") {
            const taskCount = (currentData.taskCount || 0) + 1;
            const newTask: TaskObject = {
              title: data.data,
              id: `${currentData.id}-${taskCount}`,
              createdAt: new Date().toISOString(), // Add timestamp for better tracking
            };

            updatedData.taskCount = taskCount;
            updatedData.tasks = [...existingList, newTask];
          }

          return updatedData;
        });
    } else {
      // Simple update for non-list categories
      await admin
        .database()
        .ref(data.path)
        .update({
          [data.category]: data.data,
        });
    }

    return new Response("Changes Made", {
      status: 200,
      headers: {
        "Content-Type": "text/plain",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error("Database update failed:", error);
    return new Response("Database update failed", { status: 500 });
  }
}
