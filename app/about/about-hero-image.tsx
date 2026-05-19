"use client";

import { ComparisonSlider } from "@/components/ui/comparison-slider";

export function AboutHeroImage() {
  return (
    <div
      className="mx-auto w-full max-w-full select-none sm:max-w-[360px] md:max-w-[400px] [-webkit-touch-callout:none]"
      onContextMenu={(e) => e.preventDefault()}
    >
      <ComparisonSlider
        beforeSrc="/comparison-before.png"
        afterSrc="/comparison-after.png"
        beforeAlt="QR fizikal asal — kabur dan tidak jelas"
        afterAlt="QR digital selepas ditukar — jelas dan kemas"
        beforeLabel="Sebelum"
        afterLabel="Selepas"
        defaultPosition={50}
      />
    </div>
  );
}
