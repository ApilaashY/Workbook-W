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

  // Get the task data from the database
  const initialData = await get(ref(db, data.path));
  if (!initialData.val()) return new Response("Unknown or undefined task path");

  // Increment to the data list if the category is a list
  // Updates the value and send it to the database
  if (data.category in ["tasks"]) {
    update(ref(db, data.path), {
      [data.category]: [...initialData.val()[data.category], data.data],
    });
  } else {
    update(ref(db, data.path), {
      [data.category]: data.data,
    });
  }

  return new Response("Changes Made");
}
