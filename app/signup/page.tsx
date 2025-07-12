"use client";

import { useState } from "react";
import "./Signup.css";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  type UserCredential,
} from "firebase/auth";
import type { FirebaseError } from "firebase/app";
import { doc, setDoc } from "firebase/firestore";
import { auth, fdb } from "@/lib/firebase";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

export default function Signup() {
  const router = useRouter();
  const params = useSearchParams();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState<string>(params.get("email") || "");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [hidePassword, setHidePassword] = useState(true);
  const [hideRepeatPassword, setHideRepeatPassword] = useState(true);

  async function handleSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (username.trim().length < 0) {
      alert("Username can not be empty.");
      return;
    } else if (password !== repeatPassword) {
      alert("Passwords do not match. Please try again.");
      return;
    } else if (password.length < 8) {
      alert("Password must be at least 8 characters long.");
      return;
    }

    try {
      let user: UserCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      updateProfile(user.user, {
        displayName: username,
      });

      await setDoc(doc(fdb, "Users", user.user.uid), {
        username: username,
        projects: [],
        projectCount: 0,
      });

      router.push("/app");
    } catch (error: FirebaseError | any) {
      if (error.code === "auth/wrong-password") {
        alert("Incorrect password. Please try again.");
      } else if (error.code === "auth/user-not-found") {
        alert(
          "No user found with this email. Please check your email or register."
        );
      } else if (error.code === "auth/email-already-in-use") {
        alert("This email is already in use. Please use a different email.");
        router.push(`/login?email=${email}`);
      } else {
        console.log(error);
      }
    }
  }

  return (
    <div className="signup-window">
      <div className="signup-card">
        <h1>Create your account</h1>
        <form onSubmit={handleSignup}>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label htmlFor="password">Password:</label>
          <div style={{ position: "relative", width: "100%" }}>
            <input
              type={hidePassword ? "password" : "text"}
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setHidePassword((v) => !v)}
              className="toggle-hide-password"
              style={{
                position: "absolute",
                right: 0,
                top: 0,
                height: "100%",
                border: "none",
                background: "transparent",
                cursor: "pointer",
                padding: "0 0.5em",
                transitionDuration: "0.2s",
              }}
            >
              {hidePassword ? "Show" : "Hide"}
            </button>
          </div>
          <label htmlFor="repeat password">Confirm Password:</label>
          <div style={{ position: "relative", width: "100%" }}>
            <input
              type={hideRepeatPassword ? "password" : "text"}
              name="repeat password"
              value={repeatPassword}
              onChange={(e) => setRepeatPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setHideRepeatPassword((v) => !v)}
              className="toggle-hide-password"
              style={{
                position: "absolute",
                right: 0,
                top: 0,
                height: "100%",
                border: "none",
                background: "transparent",
                cursor: "pointer",
                padding: "0 0.5em",
                transitionDuration: "0.2s",
              }}
            >
              {hideRepeatPassword ? "Show" : "Hide"}
            </button>
          </div>
          <input type="submit" value="Create Account" />
        </form>
        <Link
          href={{ pathname: "/login", query: email }}
          style={{ textAlign: "center", color: "blue" }}
        >
          Already have an account?
        </Link>
      </div>
    </div>
  );
}
