import admin from "firebase-admin";

if (!admin.apps.length) {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_BASE64
    ? Buffer.from(process.env.FIREBASE_BASE64, "base64").toString("utf8")
    : undefined;

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error("Missing Firebase environment variables");
  }

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey: privateKey, //.replace(/\\n/g, "\n"),
    }),
    databaseURL: "https://workbook-b27a1.firebaseio.com/",
  });
}

export default admin;
