"use client";

import Link from "next/link";
import { useState } from "react";
import { auth } from "../firebase";

export default function AuthNav() {
  const [hasAuth, setHasAuth] = useState<boolean | null>(null);

  auth.onAuthStateChanged((user) => {
    if (user) {
      setHasAuth(true);
    } else {
      setHasAuth(false);
    }
  });

  if (hasAuth === true) {
    // Logged-in users see their Dashboard link
    return <Link href="/app">Dashboard</Link>;
  }

  // Both the unauthenticated state (hasAuth === false) AND the initial
  // SSR/loading state (hasAuth === null) show only public links.
  // This prevents Google's crawler from ever seeing links to /app,
  // which redirects to a login wall and violates AdSense policy.
  return (
    <>
      <Link href="/login">Login</Link>
      <Link href="/signup">Register</Link>
    </>
  );
}
