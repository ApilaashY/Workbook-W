import { db } from "@/lib/firebase";
import { ref, update } from "firebase/database";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  let data;
  console.log("hi");

  try {
    data = await request.json();
  } catch (error) {
    return new Response("No JSON body provided");
  }

  console.log(data);

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
  update(ref(db, data.id), data.data);
  return new Response("Changes Made");
}
