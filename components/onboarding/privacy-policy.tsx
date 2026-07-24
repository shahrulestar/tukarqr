"use client";

import { Button, actionButtonClassName } from "@/components/ui/button";
import { Icon, Shield01Icon } from "@/components/ui/icon";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface PrivacyPolicyProps {
  onDone: () => void;
}

export function PrivacyPolicy({ onDone }: PrivacyPolicyProps) {
  const t = useT();
  const points = [
    t("onboarding.privacy.point1"),
    t("onboarding.privacy.point2"),
    t("onboarding.privacy.point3"),
  ];
  return (
    <div className="space-y-6">
      <div className="flex gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
          <Icon icon={Shield01Icon} size={16} className="size-4 text-primary" />
        </div>
        <div className="space-y-2">
          {points.map((point, index) => (
            <p
              key={index}
              className="text-[13px] leading-[1.6] text-muted-foreground"
            >
              {point}
            </p>
          ))}
        </div>
      </div>
      <Button
        size="lg"
        onClick={onDone}
        className={cn(
          actionButtonClassName,
          "focus:outline-none focus-visible:outline-none focus-visible:ring-0"
        )}
        tabIndex={-1}
      >
        {t("onboarding.privacy.done")}
      </Button>
    </div>
  );
}
