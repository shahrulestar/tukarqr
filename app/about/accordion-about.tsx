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
import { cn } from "@/lib/utils";
import accordionContent from "@/lib/accordion-content.json";

interface AccordionAudienceItem {
  title: string;
  text: string;
}

type AccordionBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "list"; ordered?: boolean; items: string[] }
  | {
      type: "audiences";
      items: AccordionAudienceItem[];
    }
  | {
      type: "link";
      href: string;
      label: string;
      variant?: "button";
    };

interface AccordionContentItem {
  value: string;
  title: string;
  noBorder?: boolean;
  blocks: AccordionBlock[];
}

const content = accordionContent as {
  defaultOpen: string[];
  feedback: { textBefore: string; email: string };
  items: AccordionContentItem[];
};

const contentClassName =
  "text-[14px] leading-relaxed text-muted-foreground [&_[data-slot=button]]:no-underline [&_[data-slot=button]:hover]:no-underline";

function AccordionBlockRenderer({ block }: { block: AccordionBlock }) {
  switch (block.type) {
    case "paragraph":
      return <p>{block.text}</p>;
    case "heading":
      return (
        <h3 className="text-[14px] font-semibold text-foreground">
          {block.text}
        </h3>
      );
    case "list":
      return (
        <ol
          className={
            block.ordered
              ? "list-decimal list-inside space-y-1"
              : "list-disc list-inside space-y-1"
          }
        >
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      );
    case "audiences":
      return (
        <ol className="flex list-decimal list-inside flex-col gap-3">
          {block.items.map((item) => (
            <li key={item.title}>
              <span className="font-semibold text-foreground">{item.title}</span>
              <p className="mt-1">{item.text}</p>
            </li>
          ))}
        </ol>
      );
    case "link":
      if (block.variant === "button") {
        return (
          <Button asChild className="mt-1 !no-underline hover:!no-underline">
            <Link href={block.href}>{block.label}</Link>
          </Button>
        );
      }
      return (
        <Link
          href={block.href}
          className="text-foreground underline-offset-3 hover:underline"
        >
          {block.label}
        </Link>
      );
    default:
      return null;
  }
}

export function AccordionAbout() {
  const [openSections, setOpenSections] = useState<string[]>(
    content.defaultOpen
  );

  return (
    <div className="space-y-4">
      <Accordion
        type="multiple"
        value={openSections}
        onValueChange={setOpenSections}
        className="rounded-xl border border-border bg-muted/30 px-4 sm:px-5"
      >
        {content.items.map((item) => (
          <AccordionItem
            key={item.value}
            value={item.value}
            className={cn(
              "data-open:bg-transparent",
              item.noBorder && "border-b-0"
            )}
          >
            <AccordionTrigger className="text-base font-semibold">
              {item.title}
            </AccordionTrigger>
            <AccordionContent className={contentClassName}>
              {item.blocks.map((block, index) => (
                <AccordionBlockRenderer
                  key={`${item.value}-${index}`}
                  block={block}
                />
              ))}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <span className="block text-center text-[14px] leading-relaxed text-muted-foreground">
        {content.feedback.textBefore}{" "}
        <a
          href={`mailto:${content.feedback.email}`}
          className="text-foreground underline-offset-3 hover:underline"
        >
          {content.feedback.email}
        </a>
      </span>
    </div>
  );
}
