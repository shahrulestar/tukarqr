"use client";

import { Button, actionButtonClassName } from "@/components/ui/button";
import {
  Download01Icon,
  Icon,
  Image01Icon,
  ScanIcon,
} from "@/components/ui/icon";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

interface HowToStartProps {
  onNext: () => void;
}

const steps: {
  icon: ComponentProps<typeof Icon>["icon"];
  title: string;
  description: string;
}[] = [
  {
    icon: Image01Icon,
    title: "Muat naik atau ambil gambar",
    description:
      "Muat naik foto DuitNow QR atau ambil gambar menggunakan kamera peranti anda.",
  },
  {
    icon: ScanIcon,
    title: "Dekod dan sahkan",
    description:
      "Sistem akan dekod dan sahkan bahawa ia ialah DuitNow QR pembayaran Malaysia.",
  },
  {
    icon: Download01Icon,
    title: "Muat turun atau salin",
    description: "Muat turun imej QR yang jelas atau salin ke papan keratan.",
  },
];

export function HowToStart({ onNext }: HowToStartProps) {
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
        Seterusnya
      </Button>
    </div>
  );
}
