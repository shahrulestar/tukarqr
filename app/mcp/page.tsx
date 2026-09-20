import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site-config";
import { McpContent } from "./mcp-content";

export const metadata: Metadata = {
  title: {
    absolute: "MCP Server - Tukar QR",
  },
  description:
    "Pasang TukarQR MCP untuk validate, parse, decode imej, dan eksport QR DuitNow bergaya dari Cursor atau Claude Desktop.",
  alternates: {
    canonical: `${SITE_URL}/mcp`,
  },
};

export default function McpPage() {
  return <McpContent />;
}
