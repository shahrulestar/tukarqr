"use client";

import { useEffect, useState } from "react";

const KEYBOARD_OPEN_THRESHOLD_PX = 60;

interface KeyboardInset {
  bottom: number;
  visibleHeight: number;
  isKeyboardOpen: boolean;
}

const CLOSED_INSET: KeyboardInset = {
  bottom: 0,
  visibleHeight: 0,
  isKeyboardOpen: false,
};

export function useKeyboardInset(enabled: boolean): KeyboardInset {
  const [inset, setInset] = useState<KeyboardInset>(CLOSED_INSET);

  useEffect(() => {
    if (!enabled || typeof window === "undefined") {
      setInset(CLOSED_INSET);
      return;
    }

    const viewport = window.visualViewport;
    if (!viewport) {
      setInset({
        bottom: 0,
        visibleHeight: window.innerHeight,
        isKeyboardOpen: false,
      });
      return;
    }

    function update() {
      const bottom = Math.max(
        0,
        window.innerHeight - viewport.height - viewport.offsetTop
      );

      setInset({
        bottom,
        visibleHeight: viewport.height,
        isKeyboardOpen: bottom > KEYBOARD_OPEN_THRESHOLD_PX,
      });
    }

    update();
    viewport.addEventListener("resize", update);
    viewport.addEventListener("scroll", update);
    window.addEventListener("orientationchange", update);

    return () => {
      viewport.removeEventListener("resize", update);
      viewport.removeEventListener("scroll", update);
      window.removeEventListener("orientationchange", update);
    };
  }, [enabled]);

  return inset;
}
