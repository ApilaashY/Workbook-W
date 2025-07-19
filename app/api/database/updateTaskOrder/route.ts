import { db } from "@/lib/firebase";
import { get, ref, update } from "firebase/database";
import { NextRequest } from "next/server";

function arrayMove(array: unknown[], from: number, to: number) {
  const arr = array.slice();
  const item = arr.splice(from, 1)[0];
  arr.splice(to, 0, item);
  return arr;
}

export async function POST(request: NextRequest) {
  const { path, active, over } = await request.json();

  // Check if id, active, and over are valid
  if (!path || !active || !over) {
    return new Response("Invalid data", { status: 400 });
  }

  // Get the task order from the database
  const taskOrder = await get(ref(db, path));

  try {
    update(ref(db, path), {
      tasks: arrayMove(taskOrder.val().tasks || [], active, over),
    });
  } catch {
    return new Response("Failed to update task order", { status: 500 });
  }

  return new Response("Task order updated successfully", { status: 200 });
}
