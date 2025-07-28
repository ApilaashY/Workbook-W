"use client";

import { auth } from "@/lib/firebase";
import "./Profile.css";
import { useRouter } from "next/navigation";
import { FaEdit } from "react-icons/fa";
import { useEffect, useState } from "react";
import { updateProfile } from "firebase/auth";
import { useDispatch } from "react-redux";
import { clearProjects } from "@/lib/store";

export default function Profile() {
  // Hooks
  const router = useRouter();
  const dispatch = useDispatch();

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
  async function updateUsername() {
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

    // Change the username state
    // It will be changed back if the API request fails
    const oldUsername = username;
    await updateProfile(auth.currentUser, { displayName: newUsername });
    setUsername(newUsername);

    // Send the api request to update the username
    const response = await fetch(`${process.env.NEXT_PUBLIC_LINK}/api/auth`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await auth.currentUser.getIdToken()}`,
      },
      body: JSON.stringify({ username: newUsername, oldUsername: oldUsername }),
    });

    if (!response.ok) {
      await updateProfile(auth.currentUser, { displayName: oldUsername });
      setUsername(oldUsername);
      alert("Failed to update username");
      return;
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
        <button
          onClick={() => {
            dispatch(clearProjects());
            auth.signOut();
          }}
          className="signout-button"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
