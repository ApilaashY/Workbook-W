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

  console.log("Check 1");

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
  console.log("Check 2");

  // Increment to the data list if the category is a list
  // Updates the value and send it to the database
  if (["tasks"].includes(data.category)) {
    // Get the task data from the database
    const initialData = await admin.database().ref(data.path).get();
    if (!initialData.val())
      return new Response("Unknown or undefined task path", { status: 404 });

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
          createdAt: new Date().toISOString(),
        } as TaskObject,
      ];
    }

    admin.database().ref(data.path).update(newData);
  } else {
    console.log("Check 3");

    console.log(data.path);
    console.log(data.category, data.data);

    admin
      .database()
      .ref(data.path)
      .update({
        [data.category]: data.data,
      });
  }

  console.log("Check 4");

  return new Response("Changes Made", { status: 200 });
}
