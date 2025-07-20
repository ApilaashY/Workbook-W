import admin from "firebase-admin";

if (!admin.apps.length) {
  console.log(process.env.FIREBASE_PROJECT_ID);
  console.log(process.env.FIREBASE_CLIENT_EMAIL);
  console.log(process.env.FIREBASE_PRIVATE_KEY);
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
    databaseURL: "https://workbook-b27a1.firebaseio.com/",
  });
}

export default admin;
