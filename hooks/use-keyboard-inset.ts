"use client";

import { useSyncExternalStore } from "react";

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

function getKeyboardInset(): KeyboardInset {
  if (typeof window === "undefined") return CLOSED_INSET;

  const viewport = window.visualViewport;
  if (!viewport) {
    return {
      bottom: 0,
      visibleHeight: window.innerHeight,
      isKeyboardOpen: false,
    };
  }

  const bottom = Math.max(
    0,
    window.innerHeight - viewport.height - viewport.offsetTop
  );

  return {
    bottom,
    visibleHeight: viewport.height,
    isKeyboardOpen: bottom > KEYBOARD_OPEN_THRESHOLD_PX,
  };
}

function subscribeToKeyboardInset(onStoreChange: () => void) {
  const viewport = window.visualViewport;
  if (!viewport) return () => {};

  viewport.addEventListener("resize", onStoreChange);
  viewport.addEventListener("scroll", onStoreChange);
  window.addEventListener("orientationchange", onStoreChange);

  return () => {
    viewport.removeEventListener("resize", onStoreChange);
    viewport.removeEventListener("scroll", onStoreChange);
    window.removeEventListener("orientationchange", onStoreChange);
  };
}

function getServerSnapshot(): KeyboardInset {
  return CLOSED_INSET;
}

export function useKeyboardInset(enabled: boolean): KeyboardInset {
  const inset = useSyncExternalStore(
    enabled ? subscribeToKeyboardInset : () => () => {},
    enabled ? getKeyboardInset : () => CLOSED_INSET,
    getServerSnapshot
  );

  return inset;
}
