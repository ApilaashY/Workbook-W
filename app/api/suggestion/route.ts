import { fdb } from "@/lib/firebase";
import { addDoc, collection } from "firebase/firestore";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  // Get suggestion from request body
  try {
    const { suggestion } = await request.json();

    // Add suggestion to firebase collection
    await addDoc(collection(fdb, "Feedback"), { suggestion });

    return new Response(JSON.stringify({ message: "Suggestion saved." }), {
      status: 200,
    });
  } catch {
    return new Response(JSON.stringify({ error: "Invalid request body." }), {
      status: 400,
    });
  }
}
