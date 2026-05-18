import type { Metadata } from "next";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import acquirersData from "@/lib/duitnow-acquirers.json";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://tukarqr.my";

const listPageTitle =
  "Senarai bank dan institusi kewangan yang menyokong DuitNow QR di Malaysia.";

export const metadata: Metadata = {
  title: {
    absolute: listPageTitle,
  },
  description: listPageTitle,
  alternates: {
    canonical: `${siteUrl}/list`,
  },
  openGraph: {
    title: listPageTitle,
    description: listPageTitle,
  },
  twitter: {
    card: "summary",
    title: listPageTitle,
    description: listPageTitle,
  },
};

interface Acquirer {
  no: number;
  name: string;
}

export default function ListPage() {
  const acquirers = acquirersData.acquirers as Acquirer[];
  const sourceUrl = acquirersData.source;

  return (
    <main className="bg-background px-4 py-8 sm:py-12">
      <div className="mx-auto max-w-[800px] w-full space-y-6">
        <header>
          <h1 className="text-xl md:text-2xl font-semibold tracking-tight">
            {listPageTitle}
          </h1>
        </header>

        <div className="rounded-xl border border-border overflow-hidden">
          <Table>
            <TableCaption className="pb-4">
              {acquirers.length} bank dan institusi menyokong DuitNow.
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">No</TableHead>
                <TableHead>Nama</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {acquirers.map((acquirer) => (
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

        <p className="text-[13px] leading-[1.6] text-muted-foreground">
          Sumber:{" "}
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground underline underline-offset-4 hover:text-primary"
          >
            Paynet
          </a>
        </p>
      </div>
    </main>
  );
}
