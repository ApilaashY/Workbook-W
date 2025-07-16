"use client";

import { Suspense, useState } from "react";
import "./ForgotPassword.css";
import { sendPasswordResetEmail } from "firebase/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { auth } from "@/lib/firebase";
import Link from "next/link";

function ForgotPasswordForm() {
  // Hooks
  const router = useRouter();
  const params = useSearchParams();

  // Variables
  const [email, setEmail] = useState(params.get("email") || "");

  // Function that handles the password reset process
  async function handleForgotPassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); // Prevent redirects

    // Send the password reset email
    await sendPasswordResetEmail(auth, email);

    alert("Password reset email sent. Please check your inbox.");

    router.push(`/login?email=${email}`); // go back to login page
  }

  return (
    <div className="forgot-password-window">
      <div className="forgot-password-card">
        <h1>Forgot Password</h1>
        <form onSubmit={handleForgotPassword}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input type="submit" value="Send Password Reset Request" />
        </form>
        <Link
          href={{ pathname: "/login", query: `email=${email}` }}
          style={{ textAlign: "center", color: "blue" }}
        >
          Remembered your password?
        </Link>
      </div>
    </div>
  );
}

export default function ForgotPassword() {
  // The Suspense is needed for the useSearchParams to work correctly
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ForgotPasswordForm />
    </Suspense>
  );
}
