"use client";

import { auth } from "@/lib/firebase";
import "./Profile.css";
import { useRouter } from "next/navigation";
import { FaEdit } from "react-icons/fa";
import { useEffect } from "react";

export default function Profile() {
  const router = useRouter();

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push("/app");
      }
    });
  });
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexGrow: "1",
      }}
    >
      <div className="profile-list">
        <h1>
          {auth.currentUser?.displayName} <FaEdit />
        </h1>
        <button onClick={() => auth.signOut()} className="signout-button">
          Sign Out
        </button>
      </div>
    </div>
  );
}
