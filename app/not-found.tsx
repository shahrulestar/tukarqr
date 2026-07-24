"use client";

import Link from "next/link";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useT } from "@/lib/i18n";

export default function NotFound() {
  const t = useT();

  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center bg-background px-4 text-center">
      <LanguageSwitcher className="absolute top-4 right-4" />
      <h1 className="text-6xl font-bold tracking-tight text-foreground">
        {t("notFound.code")}
      </h1>
      <p className="mt-3 text-lg text-muted-foreground">
        {t("notFound.message")}
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center justify-center rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        {t("notFound.cta")}
      </Link>
    </main>
  );
}
