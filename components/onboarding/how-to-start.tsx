"use client";

import { Button, actionButtonClassName } from "@/components/ui/button";
import {
  DownloadCircle01Icon,
  Icon,
  Image01Icon,
  ScanIcon,
} from "@/components/ui/icon";
import type { ComponentProps } from "react";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface HowToStartProps {
  onNext: () => void;
}

export function HowToStart({ onNext }: HowToStartProps) {
  const t = useT();
  const steps: {
    icon: ComponentProps<typeof Icon>["icon"];
    title: string;
    description: string;
  }[] = [
    {
      icon: Image01Icon,
      title: t("onboarding.howTo.step1.title"),
      description: t("onboarding.howTo.step1.description"),
    },
    {
      icon: ScanIcon,
      title: t("onboarding.howTo.step2.title"),
      description: t("onboarding.howTo.step2.description"),
    },
    {
      icon: DownloadCircle01Icon,
      title: t("onboarding.howTo.step3.title"),
      description: t("onboarding.howTo.step3.description"),
    },
  ];
  return (
    <div className="space-y-6">
      <ol className="space-y-4">
        {steps.map((step, index) => (
          <li key={index} className="flex gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <Icon
                icon={step.icon}
                size={16}
                className="size-4 text-primary"
              />
            </div>
            <div className="space-y-0.5">
              <p className="text-[14px] font-medium text-foreground">
                {step.title}
              </p>
              <p className="text-[13px] leading-[1.5] text-muted-foreground">
                {step.description}
              </p>
            </div>
          </li>
        ))}
      </ol>
      <Button
        size="lg"
        onClick={onNext}
        className={cn(
          actionButtonClassName,
          "focus:outline-none focus-visible:outline-none focus-visible:ring-0"
        )}
        tabIndex={-1}
      >
        {t("onboarding.howTo.next")}
      </Button>
    </div>
  );
}
