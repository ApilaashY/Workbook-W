import { useState } from "react";
import "./Login.css";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { Link, useLocation, useNavigate } from "react-router-dom";
import type { FirebaseError } from "firebase/app";

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState(location.state || "");
  const [password, setPassword] = useState("");
  const [hidePassword, setHidePassword] = useState(true);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, password);
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
          to="/signup"
          state={email}
          style={{ textAlign: "center", color: "blue" }}
        >
          Don't have an account?
        </Link>
        <Link
          to="/forgot-password"
          state={email}
          style={{ textAlign: "center", color: "blue" }}
        >
          Forgot your password?
        </Link>
      </div>
    </div>
  );
}
