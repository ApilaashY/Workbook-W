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
    return <Link href="/app">Dashboard</Link>;
  } else if (hasAuth === false) {
    return (
      <>
        <Link href="/login">Login</Link>
        <Link href="/signup">Register</Link>
        <Link href="/app?sample=true">Sample</Link>
      </>
    );
  }
  return (
    <>
      <Link href="/login">Login</Link>
      <Link href="/signup">Register</Link>
      <Link href="/app">Dashboard</Link>
      <Link href="/app?sample=true">Sample</Link>
    </>
  );
}
