"use client";

import { Button } from "@/components/ui/button";
import { ImageIcon, Scan, Download } from "lucide-react";

interface HowToStartProps {
  onNext: () => void;
}

const steps = [
  {
    icon: ImageIcon,
    title: "Muat naik atau ambil gambar",
    description: "Muat naik foto DuitNow QR atau ambil gambar menggunakan kamera peranti anda.",
  },
  {
    icon: Scan,
    title: "Dekod dan sahkan",
    description: "Sistem akan dekod dan sahkan bahawa ia ialah DuitNow QR pembayaran Malaysia.",
  },
  {
    icon: Download,
    title: "Muat turun atau salin",
    description: "Muat turun imej QR yang jelas atau salin ke papan keratan.",
  },
];

export function HowToStart({ onNext }: HowToStartProps) {
  return (
    <div className="space-y-6">
      <ol className="space-y-4">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <li key={index} className="flex gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Icon className="size-4 text-primary" />
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
          );
        })}
      </ol>
      <Button onClick={onNext} className="w-full focus:outline-none focus-visible:outline-none focus-visible:ring-0" tabIndex={-1}>
        Seterusnya
      </Button>
    </div>
  );
}
