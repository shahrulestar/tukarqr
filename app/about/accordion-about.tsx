"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useT } from "@/lib/i18n";

const FEEDBACK_EMAIL = "hello@shahrulestar.com";
const DEFAULT_OPEN = ["bagaimana"];

const contentClassName =
  "text-[14px] leading-relaxed text-muted-foreground [&_[data-slot=button]]:no-underline [&_[data-slot=button]:hover]:no-underline";

export function AccordionAbout() {
  const t = useT();
  const [openSections, setOpenSections] = useState<string[]>(DEFAULT_OPEN);

  const audiences = [
    "personal",
    "business",
    "seller",
    "designer",
    "anyone",
  ] as const;

  return (
    <div className="space-y-4">
      <Accordion
        type="multiple"
        value={openSections}
        onValueChange={setOpenSections}
        className="rounded-xl border border-border bg-muted/30"
      >
        <AccordionItem value="bagaimana" className="data-open:bg-transparent">
          <AccordionTrigger className="text-base font-semibold">
            {t("accordion.howItWorks.title")}
          </AccordionTrigger>
          <AccordionContent className={contentClassName}>
            <p>{t("accordion.howItWorks.p1")}</p>
            <p>{t("accordion.howItWorks.p2")}</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>{t("accordion.howItWorks.step1")}</li>
              <li>{t("accordion.howItWorks.step2")}</li>
              <li>{t("accordion.howItWorks.step3")}</li>
            </ol>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="keselamatan" className="data-open:bg-transparent">
          <AccordionTrigger className="text-base font-semibold">
            {t("accordion.security.title")}
          </AccordionTrigger>
          <AccordionContent className={contentClassName}>
            <p>{t("accordion.security.body")}</p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="pengesahan" className="data-open:bg-transparent">
          <AccordionTrigger className="text-base font-semibold">
            {t("accordion.validation.title")}
          </AccordionTrigger>
          <AccordionContent className={contentClassName}>
            <p>{t("accordion.validation.body")}</p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="kenapa" className="data-open:bg-transparent">
          <AccordionTrigger className="text-base font-semibold">
            {t("accordion.why.title")}
          </AccordionTrigger>
          <AccordionContent className={contentClassName}>
            <p>{t("accordion.why.p1")}</p>
            <p>{t("accordion.why.p2")}</p>
            <h3 className="text-[14px] font-semibold text-foreground">
              {t("accordion.why.suitableHeading")}
            </h3>
            <ol className="flex list-decimal list-inside flex-col gap-3">
              {audiences.map((key) => (
                <li key={key}>
                  <span className="font-semibold text-foreground">
                    {t(`accordion.why.audience.${key}.title`)}
                  </span>
                  <p className="mt-1">
                    {t(`accordion.why.audience.${key}.text`)}
                  </p>
                </li>
              ))}
            </ol>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="senarai-bank" className="data-open:bg-transparent">
          <AccordionTrigger className="text-base font-semibold">
            {t("accordion.banks.title")}
          </AccordionTrigger>
          <AccordionContent className={contentClassName}>
            <p>{t("accordion.banks.body")}</p>
            <Button asChild className="mt-1 !no-underline hover:!no-underline">
              <Link href="/list">{t("accordion.banks.cta")}</Link>
            </Button>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem
          value="penafian"
          className="data-open:bg-transparent border-b-0"
        >
          <AccordionTrigger className="text-base font-semibold">
            {t("accordion.disclaimer.title")}
          </AccordionTrigger>
          <AccordionContent className={contentClassName}>
            <p>{t("accordion.disclaimer.p1")}</p>
            <p>{t("accordion.disclaimer.p2")}</p>
            <p>{t("accordion.disclaimer.p3")}</p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <span className="block text-center text-[14px] leading-relaxed text-muted-foreground">
        {t("accordion.feedback.before")}{" "}
        <a
          href={`mailto:${FEEDBACK_EMAIL}`}
          className="text-foreground underline-offset-3 hover:underline"
        >
          {FEEDBACK_EMAIL}
        </a>
      </span>
    </div>
  );
}
