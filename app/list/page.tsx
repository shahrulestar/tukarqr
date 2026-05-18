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

export const metadata: Metadata = {
  title: {
    absolute: "List of Acquirer IDs with Verified Bank Types",
  },
  description:
    "Senarai lengkap Acquirer IDs untuk bank dan institusi kewangan yang menyokong DuitNow QR di Malaysia.",
  alternates: {
    canonical: `${siteUrl}/list`,
  },
  openGraph: {
    title: "List of Acquirer IDs with Verified Bank Types",
    description:
      "Senarai lengkap Acquirer IDs untuk bank dan institusi kewangan yang menyokong DuitNow QR di Malaysia.",
  },
  twitter: {
    card: "summary",
    title: "List of Acquirer IDs with Verified Bank Types",
  },
};

interface Acquirer {
  no: number;
  name: string;
}

export default function ListPage() {
  const acquirers = acquirersData.acquirers as Acquirer[];

  return (
    <main className="min-h-screen bg-background px-4 py-8 sm:py-12">
      <div className="mx-auto max-w-[800px] w-full space-y-6">
        <header className="space-y-2">
          <h1 className="text-xl md:text-2xl font-semibold tracking-tight">
            List of Acquirer IDs with Verified Bank Types
          </h1>
          <p className="text-[14px] leading-[1.6] text-muted-foreground">
            Senarai bank dan institusi kewangan yang menyokong DuitNow QR di
            Malaysia.
          </p>
        </header>

        <div className="rounded-xl border border-border overflow-hidden">
          <Table>
            <TableCaption className="pb-4">
              {acquirers.length} acquirers menyokong DuitNow.
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">No</TableHead>
                <TableHead>Name</TableHead>
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
      </div>
    </main>
  );
}
