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
  if (data.path === undefined || typeof data.path !== "string") {
    return new Response("Invalid data format");
  }

  // Update the data in the path in the database to empty to delete it
  await admin.database().ref(data.path).update({
    archived: true,
  });

  return new Response("Task archived successfully");
}
