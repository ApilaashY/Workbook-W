import { useState } from "react";
import "./Signup.css";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import type { FirebaseError } from "firebase/app";

export function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [hidePassword, setHidePassword] = useState(true);
  const [hideRepeatPassword, setHideRepeatPassword] = useState(true);
  const navigate = useNavigate();

  async function handleSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/");
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
    <div className="signup-window">
      <div className="signup-card">
        <h1>Create your account</h1>
        <form onSubmit={handleSignup}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            name="password"
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
        <Link to="/login" style={{ textAlign: "center" }}>
          Already have an account?
        </Link>
      </div>
    </div>
  );
}
