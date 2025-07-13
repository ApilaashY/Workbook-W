"use client";

import { Suspense, useState } from "react";
import "./ForgotPassword.css";
import { sendPasswordResetEmail } from "firebase/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { auth } from "@/lib/firebase";
import Link from "next/link";

export default function ForgotPassword() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState(params.get("email") || "");

  async function handleForgotPassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    await sendPasswordResetEmail(auth, email);

    alert("Password reset email sent. Please check your inbox.");

    router.push(`/login?email=${email}`);
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
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
    </Suspense>
  );
}
