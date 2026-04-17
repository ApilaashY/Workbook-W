import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./index.css";
import { GoogleAnalytics } from "@next/third-parties/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  fallback: [
    "system-ui",
    "-apple-system",
    "BlinkMacSystemFont",
    "Segoe UI",
    "sans-serif",
  ],
  adjustFontFallback: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: false, // Don't preload mono font, it's less critical
  fallback: ["Courier New", "monospace"],
  adjustFontFallback: true,
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
        {/* Google AdSense — must be in <head> as a real script tag so Google's
            crawler can verify site ownership. strategy="afterInteractive" loads
            it after hydration without blocking the initial paint. */}
        <Script
          id="adsense-init"
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4914732861439858"
          crossOrigin="anonymous"
          strategy="afterInteractive"
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
        {/* Load analytics after main content - lazy loaded for mobile performance */}
        <SpeedInsights />
        <GoogleAnalytics gaId="G-Q3E5ECQQ24" />
      </body>
    </html>
  );
}
