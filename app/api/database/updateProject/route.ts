import { TaskObject } from "@/lib/DataClasses/TaskClass";
import { db } from "@/lib/firebase";
import { get, ref, update } from "firebase/database";
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
    data.category === undefined ||
    data.data === undefined ||
    typeof data.path !== "string" ||
    typeof data.category !== "string"
  ) {
    return new Response("Invalid data format");
  }

  // Increment to the data list if the category is a list
  // Updates the value and send it to the database
  if (["tasks", "comments"].includes(data.category)) {
    // Get the task data from the database
    const initialData = await get(ref(db, data.path));
    if (!initialData.val())
      return new Response("Unknown or undefined task path");

    const newData: { [key: string]: unknown } = {
      [data.category]: [...(initialData.val()[data.category] || []), data.data],
    };

    // Increment taskCount if the category is tasks
    if (data.category === "tasks") {
      newData.taskCount = (initialData.val().taskCount || 0) + 1;
      newData.tasks = [
        ...(initialData.val().tasks || []),
        {
          title: data.data,
          id: `${initialData.val().id}-${initialData.val().taskCount || 0}`,
        } as TaskObject,
      ];
    }

    update(ref(db, data.path), newData);
  } else {
    update(ref(db, data.path), {
      [data.category]: data.data,
    });
  }

  return new Response("Changes Made");
}
