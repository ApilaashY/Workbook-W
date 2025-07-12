// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAF723ZDsQ8QoiDDSQS6F44sJMtJY98NBo",
  authDomain: "workbook-b27a1.firebaseapp.com",
  databaseURL: "https://workbook-b27a1-default-rtdb.firebaseio.com",
  projectId: "workbook-b27a1",
  storageBucket: "workbook-b27a1.appspot.com",
  messagingSenderId: "456143205277",
  appId: "1:456143205277:web:9a142df8e17814c4d47574",
  measurementId: "G-1758MD6DX9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const fdb = getFirestore(app);
export const auth = getAuth(app);
