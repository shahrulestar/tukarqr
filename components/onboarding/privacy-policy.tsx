"use client";

import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";

interface PrivacyPolicyProps {
  onDone: () => void;
}

const points = [
  "Semua pemprosesan QR berlaku dalam pelayar anda. Tiada data atau imej dihantar ke pelayan.",
  "Alat ini berjalan terus dalam pelayar anda untuk dekod dan penjanaan QR.",
  "Tiada skrip analitik pihak ketiga diperlukan untuk fungsi utama aplikasi ini.",
];

export function PrivacyPolicy({ onDone }: PrivacyPolicyProps) {
  return (
    <div className="space-y-6">
      <div className="flex gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
          <Shield className="size-4 text-primary" />
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
      <Button onClick={onDone} className="w-full focus:outline-none focus-visible:outline-none focus-visible:ring-0" tabIndex={-1}>
        Faham
      </Button>
    </div>
  );
}
