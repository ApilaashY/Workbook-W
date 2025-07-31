"use client";

import Link from "next/link";
import "./home.css";

export default function Home() {
  return (
    <>
      <nav>
        <h1>Workbook</h1>

        <div className="nav-links">
          <Link href="/">Home</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/login">Login</Link>
          <Link href="/register">Register</Link>
          <Link href="/dashboard">Dashboard</Link>
        </div>
      </nav>
    </>
  );
}
