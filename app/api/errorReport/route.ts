import { db, fdb } from "@/lib/firebase";
import admin from "@/lib/firebaseAdmin";
import { addDoc, collection } from "firebase/firestore";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  // Get new username name from request body
  const { message, className } = await request.json();
  console.log(message, className);
  if (!message || !className) {
    return new Response("No message or class provided", {
      status: 400,
    });
  }

  // Save error report to Firestore
  await addDoc(collection(fdb, "Errors"), { message, className });

  return new Response("Error report saved", { status: 200 });
}
