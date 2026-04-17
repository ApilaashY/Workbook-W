"use client";

import { useEffect } from "react";

/**
 * AdUnit renders a real <ins class="adsbygoogle"> element that Google's
 * crawler can see in the DOM, then calls (adsbygoogle).push({}) to load
 * the ad after the AdSense script (loaded in layout.tsx <head>) is ready.
 */
export default function AdUnit() {
  useEffect(() => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push(
        {},
      );
    } catch {
      // AdSense may not be ready yet; the script will auto-fill on load.
    }
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        width: "100%",
        overflow: "hidden",
        minHeight: "90px",
      }}
    >
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-4914732861439858"
        data-ad-slot="auto"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
