"use client";

import { auth } from "@/lib/firebase";
import "./Profile.css";
import { useRouter } from "next/navigation";
import { FaEdit } from "react-icons/fa";
import { useEffect, useState } from "react";
import { updateProfile } from "firebase/auth";

export default function Profile() {
  // Hooks
  const router = useRouter();

  // Variables
  const [username, setUsername] = useState(auth.currentUser?.displayName || "");

  // Go to the app page if the user is not logged in, and set the username if changed
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push("/app");
        return;
      }

      setUsername(user.displayName || "");
    });
  });

  // Change the username
  function updateUsername() {
    // Prompt the user for a new username
    let newUsername = prompt("Enter your new username:");

    if (newUsername == null) return;

    while (!newUsername || newUsername.trim() === "") {
      if (newUsername == null) return;
      newUsername = prompt(
        "Username cannot be empty. Please enter a valid username:"
      );
    }

    if (!auth.currentUser) return;

    // Change the username
    setUsername(newUsername);
    // Send the new username to Firebase
    updateProfile(auth.currentUser, { displayName: newUsername })
      .then(() => {
        alert("Username updated successfully!");
      })
      .catch((error) => {
        console.error("Error updating username:", error);
        alert("Failed to update username. Please try again.");
      });
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
