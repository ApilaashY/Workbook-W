import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./index.css";
import { GoogleAnalytics } from "@next/third-parties/google";
import { SpeedInsights } from "@vercel/speed-insights/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap", // Improves FCP by showing fallback font first
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap", // Improves FCP by showing fallback font first
});

export const metadata: Metadata = {
  title: "Workbook",
  description:
    "A project management tool for students, organizers, and more by Apilaash Yoharan.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect to Firebase to improve LCP */}
        <link rel="preconnect" href="https://workbook-b27a1.firebaseapp.com" />
        <link
          rel="preconnect"
          href="https://workbook-b27a1-default-rtdb.firebaseio.com"
        />
        <link rel="preconnect" href="https://firestore.googleapis.com" />
        <link
          rel="dns-prefetch"
          href="https://workbook-b27a1.firebaseapp.com"
        />
        <link
          rel="dns-prefetch"
          href="https://workbook-b27a1-default-rtdb.firebaseio.com"
        />
      </head>
      {/* suppressHydrationWarning prevents React from logging hydration mismatch
          warnings for transient attributes injected on the client (e.g. by
          browser extensions) that don't affect app behavior. */}
      <body
        className={`${geistSans.variable} ${geistMono.variable}`}
        suppressHydrationWarning
      >
        {children}
        {/* Load analytics after main content */}
        <SpeedInsights />
        <GoogleAnalytics gaId="G-Q3E5ECQQ24" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4914732861439858"
          crossOrigin="anonymous"
        ></script>
      </body>
    </html>
  );
}
