"use client";

import { auth } from "@/lib/firebase";
import "./Profile.css";
import { useRouter } from "next/navigation";
import { FaEdit } from "react-icons/fa";
import { useEffect, useState } from "react";
import { updateProfile } from "firebase/auth";

export default function Profile() {
  const router = useRouter();
  const [username, setUsername] = useState("");

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push("/app");
        return;
      }

      setUsername(user.displayName || "");
    });
  });

  function updateUsername() {
    let newUsername = prompt("Enter your new username:");

    if (newUsername == null) return;

    while (newUsername!.trim() === "") {
      newUsername = prompt(
        "Username cannot be empty. Please enter a valid username:"
      );
    }

    if (newUsername == null) return;

    if (newUsername) {
      if (!auth.currentUser) return;

      setUsername(newUsername);
      updateProfile(auth.currentUser, { displayName: newUsername })
        .then(() => {
          alert("Username updated successfully!");
        })
        .catch((error) => {
          console.error("Error updating username:", error);
          alert("Failed to update username. Please try again.");
        });
    }
  }

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
          {username}
          <FaEdit onClick={updateUsername} style={{ cursor: "pointer" }} />
        </h1>
        <button onClick={() => auth.signOut()} className="signout-button">
          Sign Out
        </button>
      </div>
    </div>
  );
}
