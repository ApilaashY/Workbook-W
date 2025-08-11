"use client";

import { Suspense, useState } from "react";
import "./Signup.css";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  type UserCredential,
} from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, fdb } from "@/lib/firebase";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

const provider = new GoogleAuthProvider();

function SignupForm() {
  // Hooks
  const router = useRouter();
  const params = useSearchParams();

  // Variables
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState<string>(params.get("email") || "");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [hidePassword, setHidePassword] = useState(true);
  const [hideRepeatPassword, setHideRepeatPassword] = useState(true);

  // If the user is already logged in, redirect to the app page
  auth.onAuthStateChanged((user) => {
    if (user) {
      router.push("/app");
    }
  });

  // Function that handles the signup process
  async function handleSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); // Prevent redirects

    // Make sure the username and password are good enough
    if (username.trim().length <= 0) {
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
      // Create the new user
      const user: UserCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Set the user's username
      await updateProfile(user.user, {
        displayName: username,
      });

      // Create the user data document in Firestore
      await setDoc(doc(fdb, "Users", user.user.uid), {
        username: username,
        projects: [],
        projectCount: 0,
      });

      // Send email verification
      // await sendEmailVerification(user.user, {
      //   url: `${window.location.origin}/app`, // Redirect URL after verification
      //   handleCodeInApp: false,
      // });

      // alert("Account created successfully! Please verify your email.");

      // Go to the app page
      router.push("/app");
    } catch (error: FirebaseError | unknown) {
      // Handle errors
      if (!(error instanceof FirebaseError)) return;

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
        alert("An error occurred. Please try again later.");
        console.log(error);
      }
    }
  }

  function signInWithGoogle() {
    // Implement Google sign-in logic here

    signInWithPopup(auth, provider).then(async (result) => {
      const user = result.user;

      // Create the user data document in Firestore if it doesn't exist
      if (!(await getDoc(doc(fdb, "Users", user.uid))).exists()) {
        await setDoc(doc(fdb, "Users", user.uid), {
          username: user.displayName,
          projects: [],
          projectCount: 0,
        });
      }
    });
  }

  return (
    <div className="signup-window">
      <div className="signup-card">
        <h1>Create your account</h1>
        <button className="google-signup" onClick={signInWithGoogle}>
          <Image
            src="/google-logo.png"
            alt="Google Logo"
            width={20}
            height={20}
          />
          Sign in with Google
        </button>
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

export default function Signup() {
  // The Suspense is needed for the useSearchParams to work correctly
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignupForm />
    </Suspense>
  );
}
