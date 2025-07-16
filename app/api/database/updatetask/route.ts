import { db } from "@/lib/firebase";
import { ref, update } from "firebase/database";
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
    data.id === undefined ||
    data.data === undefined ||
    typeof data.id !== "string" ||
    typeof data.data !== "object" ||
    Array.isArray(data.data) ||
    Object.keys(data.data).length === 0
  ) {
    return new Response("Invalid data format");
  }

  // Update the data in the Realtime Database and return a success response
  update(ref(db, data.id), data.data);
  return new Response("Changes Made");
}
