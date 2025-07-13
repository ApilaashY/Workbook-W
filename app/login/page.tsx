"use client";

import { Suspense, useState } from "react";
import "./Login.css";
import { signInWithEmailAndPassword } from "firebase/auth";
import type { FirebaseError } from "firebase/app";
import { useRouter, useSearchParams } from "next/navigation";
import { auth } from "@/lib/firebase";
import Link from "next/link";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState(params.get("email") || "");
  const [password, setPassword] = useState("");
  const [hidePassword, setHidePassword] = useState(true);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/app");
    } catch (error: FirebaseError | any) {
      if (error.code === "auth/wrong-password") {
        alert("Incorrect password. Please try again.");
      } else if (error.code === "auth/user-not-found") {
        alert(
          "No user found with this email. Please check your email or register."
        );
      }
    }
  }

  return (
    <div className="login-window">
      <div className="login-card">
        <h1>Login</h1>
        <form onSubmit={handleLogin}>
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
          <input type="submit" value="Login" />
        </form>
        <Link
          href={{ pathname: "/signup", query: `email=${email}` }}
          style={{ textAlign: "center", color: "blue" }}
        >
          Don't have an account?
        </Link>
        <Link
          href={{ pathname: "/forgot-password", query: `email=${email}` }}
          style={{ textAlign: "center", color: "blue" }}
        >
          Forgot your password?
        </Link>
      </div>
    </div>
  );
}

export default function Login() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
