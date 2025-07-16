import { NextRequest } from "next/server";
import { ref, set, update } from "firebase/database";
import { db } from "@/lib/firebase";

export async function POST(request: NextRequest) {
  let data;

  // Get the request's json data and if not possible return an error
  try {
    data = await request.json();
  } catch {
    return new Response("No JSON body provided");
  }

  // Check if the data has the required format and return an error if not
  if (data.path === undefined || typeof data.path !== "string") {
    return new Response("Invalid data format");
  }

  // Update the data in the path in the database to empty to delete it
  set(ref(db, data.path), null);

  return new Response("Task deleted successfully");
}
