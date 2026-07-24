"use client";

import { useState } from "react";
import { ArrowDown01Icon, ArrowUp01Icon, Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useT } from "@/lib/i18n";

const INITIAL_VISIBLE = 20;

interface Acquirer {
  no: number;
  name: string;
}

interface AcquirersTableProps {
  acquirers: Acquirer[];
}

export function AcquirersTable({ acquirers }: AcquirersTableProps) {
  const t = useT();
  const [expanded, setExpanded] = useState(false);
  const hasMore = acquirers.length > INITIAL_VISIBLE;
  const visible = expanded
    ? acquirers
    : acquirers.slice(0, INITIAL_VISIBLE);

  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">{t("list.table.no")}</TableHead>
              <TableHead>{t("list.table.name")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visible.map((acquirer) => (
              <TableRow key={acquirer.no}>
                <TableCell className="font-medium tabular-nums">
                  {acquirer.no}
                </TableCell>
                <TableCell className="whitespace-normal">
                  {acquirer.name}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {hasMore && (
        <div className="flex justify-center">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
          >
            {expanded ? (
              <>
                {t("list.showLess")}
                <Icon icon={ArrowUp01Icon} size={16} className="size-4" />
              </>
            ) : (
              <>
                {t("list.showAll", { n: acquirers.length })}
                <Icon icon={ArrowDown01Icon} size={16} className="size-4" />
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
