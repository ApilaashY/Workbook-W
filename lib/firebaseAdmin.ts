import admin from "firebase-admin";

console.log("🔥 Firebase Admin initialization starting...");

if (!admin.apps.length) {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKeyBase64 = process.env.FIREBASE_BASE64;

  console.log("🔍 Environment variables check:", {
    projectId: projectId ? "✅ Present" : "❌ Missing",
    clientEmail: clientEmail ? "✅ Present" : "❌ Missing",
    privateKeyBase64: privateKeyBase64 ? "✅ Present" : "❌ Missing",
    privateKeyLength: privateKeyBase64 ? privateKeyBase64.length : 0,
  });

  if (!projectId || !clientEmail || !privateKeyBase64) {
    console.error("❌ Missing Firebase environment variables");
    throw new Error("Missing Firebase environment variables");
  }

  let privateKey: string;
  try {
    privateKey = Buffer.from(privateKeyBase64, "base64").toString("utf8");
    console.log("✅ Private key decoded successfully");
    console.log(
      "🔑 Private key starts with:",
      privateKey.substring(0, 50) + "..."
    );
  } catch (error) {
    console.error("❌ Failed to decode private key:", error);
    throw new Error("Failed to decode private key");
  }

  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
      databaseURL: "https://workbook-b27a1.firebaseio.com/",
    });
    console.log("✅ Firebase Admin initialized successfully");
    console.log("📱 App name:", admin.app().name);
  } catch (error) {
    console.error("❌ Firebase Admin initialization failed:", error);
    throw error;
  }
} else {
  console.log("♻️ Firebase Admin already initialized");
}

export default admin;
