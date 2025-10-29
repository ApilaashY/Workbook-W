import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./index.css";
import { GoogleAnalytics } from "@next/third-parties/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4914732861439858"
          crossOrigin="anonymous"
        ></script>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4914732861439858"
          crossOrigin="anonymous"
        ></script>
      </head>
      {/* suppressHydrationWarning prevents React from logging hydration mismatch
          warnings for transient attributes injected on the client (e.g. by
          browser extensions) that don't affect app behavior. */}
      <body
        className={`${geistSans.variable} ${geistMono.variable}`}
        suppressHydrationWarning
      >
        {children}
      </body>
      <GoogleAnalytics gaId="G-Q3E5ECQQ24" />
    </html>
  );
}
