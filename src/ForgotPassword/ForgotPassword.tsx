import { useState } from "react";
import "./ForgotPassword.css";
import { Link, useLocation, useNavigate } from "react-router-dom";

export function ForgotPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState(location.state || "");

  async function handleForgotPassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    navigate("/login", { state: email });
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
          to="/login"
          state={email}
          style={{ textAlign: "center", color: "blue" }}
        >
          Remembered your password?
        </Link>
      </div>
    </div>
  );
}
