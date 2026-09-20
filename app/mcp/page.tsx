import type { Metadata } from "next";
import { SITE_URL, MCP_OG_IMAGE } from "@/lib/site-config";
import { McpContent } from "./mcp-content";

const mcpTitle = "MCP Server untuk DuitNow QR";
const mcpDescription =
  "MCP Server untuk DuitNow QR — validate, parse, decode imej, dan eksport QR bergaya yang sepadan dengan tukarqr.my. Gunakan dari Cursor, Claude Desktop, atau mana-mana klien MCP.";

export const metadata: Metadata = {
  title: {
    absolute: mcpTitle,
  },
  description: mcpDescription,
  alternates: {
    canonical: `${SITE_URL}/mcp`,
  },
  openGraph: {
    type: "website",
    locale: "ms_MY",
    siteName: "Tukar QR",
    url: `${SITE_URL}/mcp`,
    title: mcpTitle,
    description: mcpDescription,
    images: [
      {
        url: MCP_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Tukar QR MCP Server — sambungkan Cursor atau Claude ke alatan DuitNow QR",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: mcpTitle,
    description: mcpDescription,
    images: [MCP_OG_IMAGE],
  },
};

export default function McpPage() {
  return <McpContent />;
}
