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

let cachedSnapshot: KeyboardInset = CLOSED_INSET;
let cachedSnapshotKey = "";

function readKeyboardInset(): KeyboardInset {
  if (typeof window === "undefined") return CLOSED_INSET;

  const viewport = window.visualViewport;
  if (!viewport) {
    const snapshotKey = `novp:${window.innerHeight}`;
    if (cachedSnapshotKey === snapshotKey) return cachedSnapshot;

    cachedSnapshotKey = snapshotKey;
    cachedSnapshot = {
      bottom: 0,
      visibleHeight: window.innerHeight,
      isKeyboardOpen: false,
    };
    return cachedSnapshot;
  }

  const bottom = Math.max(
    0,
    window.innerHeight - viewport.height - viewport.offsetTop
  );
  const snapshotKey = `${bottom}:${viewport.height}`;

  if (cachedSnapshotKey === snapshotKey) return cachedSnapshot;

  cachedSnapshotKey = snapshotKey;
  cachedSnapshot = {
    bottom,
    visibleHeight: viewport.height,
    isKeyboardOpen: bottom > KEYBOARD_OPEN_THRESHOLD_PX,
  };
  return cachedSnapshot;
}

function getKeyboardInset(): KeyboardInset {
  return readKeyboardInset();
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
    subscribeToKeyboardInset,
    getKeyboardInset,
    getServerSnapshot
  );

  return enabled ? inset : CLOSED_INSET;
}
