"use client";

import { useEffect } from "react";

export default function AdSense() {
  useEffect(() => {
    // Only load AdSense after user interaction or after 3 seconds
    const loadAdSense = () => {
      if (document.querySelector('script[src*="adsbygoogle"]')) return;
      
      const script = document.createElement("script");
      script.src =
        "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4914732861439858";
      script.async = true;
      script.crossOrigin = "anonymous";
      document.body.appendChild(script);
    };

    // Load on first user interaction
    const events = ["mousedown", "touchstart", "keydown", "scroll"];
    const handleInteraction = () => {
      loadAdSense();
      events.forEach((event) =>
        window.removeEventListener(event, handleInteraction)
      );
    };

    events.forEach((event) =>
      window.addEventListener(event, handleInteraction, { passive: true })
    );

    // Fallback: load after 3 seconds if no interaction
    const timeout = setTimeout(loadAdSense, 3000);

    return () => {
      clearTimeout(timeout);
      events.forEach((event) =>
        window.removeEventListener(event, handleInteraction)
      );
    };
  }, []);

  return null;
}
