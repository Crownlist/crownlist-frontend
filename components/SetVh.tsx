"use client";

import { useEffect } from "react";

export default function SetVh() {
  useEffect(() => {
    const setVh = () => {
      try {
        document.documentElement.style.setProperty(
          "--vh",
          `${window.innerHeight * 0.01}px`
        );
      } catch {
        // ignore
      }
    };

    setVh();
    window.addEventListener("resize", setVh);
    window.addEventListener("orientationchange", setVh);
    // Some mobile keyboards trigger focus/blur; update on focusin/focusout
    window.addEventListener("focusin", setVh);
    window.addEventListener("focusout", setVh);

    return () => {
      window.removeEventListener("resize", setVh);
      window.removeEventListener("orientationchange", setVh);
      window.removeEventListener("focusin", setVh);
      window.removeEventListener("focusout", setVh);
    };
  }, []);

  return null;
}
