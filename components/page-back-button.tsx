"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft01Icon, Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { useT } from "@/lib/i18n";

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
  const t = useT();
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
      aria-label={t("nav.back.ariaLabel")}
      className={className}
    >
      <Icon icon={ArrowLeft01Icon} size={16} className="size-4" />
    </Button>
  );
}
