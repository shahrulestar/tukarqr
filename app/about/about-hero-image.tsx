"use client";

import { ComparisonSlider } from "@/components/ui/comparison-slider";
import { useT } from "@/lib/i18n";

export function AboutHeroImage() {
  const t = useT();

  return (
    <div
      className="mx-auto w-full max-w-full select-none sm:max-w-[360px] md:max-w-[400px] [-webkit-touch-callout:none]"
      onContextMenu={(e) => e.preventDefault()}
    >
      <ComparisonSlider
        beforeSrc="/comparison-before.png"
        afterSrc="/comparison-after.png"
        beforeAlt={t("about.hero.beforeAlt")}
        afterAlt={t("about.hero.afterAlt")}
        defaultPosition={50}
      />
    </div>
  );
}
