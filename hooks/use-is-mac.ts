"use client";

import { useEffect, useState } from "react";

export function useIsMac(): boolean {
  const [isMac, setIsMac] = useState(false);
  useEffect(() => {
    const platform =
      typeof navigator !== "undefined"
        ? navigator.platform?.toLowerCase() ?? ""
        : "";
    const uaPlatform =
      typeof navigator !== "undefined"
        ? (navigator as { userAgentData?: { platform?: string } })
            .userAgentData?.platform?.toLowerCase()
        : "";
    setIsMac(platform.includes("mac") || uaPlatform === "macos");
  }, []);
  return isMac;
}
