"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PageBackButtonProps {
  fallbackHref?: string;
  className?: string;
}

function canNavigateBack() {
  if (typeof window === "undefined") return false;

  const referrer = document.referrer;
  if (!referrer) return false;

  try {
    return new URL(referrer).origin === window.location.origin;
  } catch {
    return false;
  }
}

export function PageBackButton({
  fallbackHref = "/",
  className,
}: PageBackButtonProps) {
  const router = useRouter();

  function handleBack() {
    if (canNavigateBack()) {
      router.back();
      return;
    }

    router.push(fallbackHref);
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      onClick={handleBack}
      aria-label="Kembali"
      className={className}
    >
      <ChevronLeft />
    </Button>
  );
}
