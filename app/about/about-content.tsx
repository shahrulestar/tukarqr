"use client";

import type { ReactNode } from "react";
import { PageBackButton } from "@/components/page-back-button";
import { Button } from "@/components/ui/button";
import { useT } from "@/lib/i18n";
import { AboutHeroImage } from "./about-hero-image";
import { AccordionAbout } from "./accordion-about";

interface AboutContentProps {
  githubStars: ReactNode;
}

export function AboutContent({ githubStars }: AboutContentProps) {
  const t = useT();

  return (
    <main className="bg-background px-4 py-8 sm:py-12">
      <div className="mx-auto max-w-[800px] w-full space-y-6 text-[15px] leading-[1.7] text-foreground">
        <PageBackButton className="-ml-2" />
        <h1 className="text-xl font-semibold">{t("about.heading")}</h1>

        <AboutHeroImage />

        <p>{t("about.intro")}</p>

        <section
          className="rounded-xl border border-border bg-muted/30 px-4 py-4 sm:px-5"
          aria-labelledby="open-source-heading"
        >
          <h2
            id="open-source-heading"
            className="text-base font-semibold text-foreground"
          >
            {t("about.openSource.heading")}
          </h2>
          <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
            {t("about.openSource.body")}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {githubStars}
            <Button variant="secondary" asChild>
              <a
                href="https://shahrulestar.com/sponsor"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t("about.openSource.sponsor")}
              </a>
            </Button>
          </div>
        </section>

        <AccordionAbout />
      </div>
    </main>
  );
}
