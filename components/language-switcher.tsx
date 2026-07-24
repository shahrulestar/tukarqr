"use client";

import { Button } from "@/components/ui/button";
import { useLocale } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";

const LABEL_KEY: Record<Locale, string> = {
  ms: "nav.language.ms",
  en: "nav.language.en",
};

interface LanguageSwitcherProps {
  className?: string;
}

export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const { locale, setLocale, t } = useLocale();
  const nextLocale: Locale = locale === "ms" ? "en" : "ms";

  return (
    <Button
      type="button"
      variant="ghost"
      aria-label={t("nav.language.ariaLabel")}
      onClick={() => setLocale(nextLocale)}
      className={className}
    >
      {t(LABEL_KEY[locale])}
    </Button>
  );
}
