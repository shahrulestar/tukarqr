"use client";

import { PageBackButton } from "@/components/page-back-button";
import { AcquirersTable } from "@/components/acquirers-table";
import { useT } from "@/lib/i18n";

interface Acquirer {
  no: number;
  name: string;
}

interface ListContentProps {
  acquirers: Acquirer[];
  sourceUrl: string;
}

export function ListContent({ acquirers, sourceUrl }: ListContentProps) {
  const t = useT();

  return (
    <main className="bg-background px-4 py-8 sm:py-12">
      <div className="mx-auto max-w-[800px] w-full space-y-6">
        <PageBackButton className="-ml-2" />
        <header>
          <h1 className="text-xl md:text-2xl font-semibold tracking-tight">
            {t("list.title")}
          </h1>
        </header>

        <AcquirersTable acquirers={acquirers} />

        <p className="text-[13px] leading-[1.6] text-muted-foreground">
          {t("list.source.label")}{" "}
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground underline underline-offset-4 hover:text-primary"
          >
            {t("list.source.link")}
          </a>
        </p>
      </div>
    </main>
  );
}
