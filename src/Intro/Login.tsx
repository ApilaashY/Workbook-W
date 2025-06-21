import { useState } from "react";
import "./Login.css";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import type { FirebaseError } from "firebase/app";

export function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        try {
            await signInWithEmailAndPassword(auth, email, password)
            navigate("/");
        } catch (error: FirebaseError | any) {
            if (error.code === "auth/wrong-password") {
                alert("Incorrect password. Please try again.");
            } else if (error.code === "auth/user-not-found") {
                alert("No user found with this email. Please check your email or register.");
            }
        }


    }

    return <div className="login-window">
        <form className="login-card" onSubmit={handleLogin}>
            <h1>Login</h1>
            <label htmlFor="email">Email:</label>
            <input type="email" name="password" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <label htmlFor="password">Password:</label>
            <input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <input type="submit" value="Login" />
        </form>
    </div>
}