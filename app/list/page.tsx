import type { Metadata } from "next";
import { ListContent } from "./list-content";
import acquirersData from "@/lib/duitnow-acquirers.json";
import { SITE_URL, DEFAULT_OG_IMAGE } from "@/lib/site-config";

const listPageTitle =
  "Senarai bank dan institusi kewangan yang menyokong DuitNow QR di Malaysia.";

export const metadata: Metadata = {
  title: {
    absolute: listPageTitle,
  },
  description: listPageTitle,
  alternates: {
    canonical: `${SITE_URL}/list`,
  },
  openGraph: {
    title: listPageTitle,
    description: listPageTitle,
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Tukar QR - DuitNow QR Lebih Jelas",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: listPageTitle,
    description: listPageTitle,
    images: [DEFAULT_OG_IMAGE],
  },
};

interface Acquirer {
  no: number;
  name: string;
}

export default function ListPage() {
  const acquirers = acquirersData.acquirers as Acquirer[];
  const sourceUrl = acquirersData.source;

  return <ListContent acquirers={acquirers} sourceUrl={sourceUrl} />;
}
