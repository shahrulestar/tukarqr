"use client";

import { useState } from "react";
import { PageBackButton } from "@/components/page-back-button";
import { Button } from "@/components/ui/button";
import { Copy01Icon, Icon } from "@/components/ui/icon";
import { useT } from "@/lib/i18n";

const MCP_ENDPOINT = "https://mcp.tukarqr.my/mcp";
const MCP_GITHUB_README =
  "https://github.com/shahrulestar/tukarqr/blob/main/mcp/README.md";

const MCP_TOOLS = [
  { name: "get_validate_duitnow_qr", descriptionKey: "mcp.tools.validate" },
  { name: "get_parse_duitnow_qr", descriptionKey: "mcp.tools.parse" },
  { name: "get_duitnow_qr_details", descriptionKey: "mcp.tools.details" },
  { name: "get_decode_qr_image", descriptionKey: "mcp.tools.decodeImage" },
  { name: "get_decode_qr_images_bulk", descriptionKey: "mcp.tools.decodeBulk" },
  { name: "get_encode_qr", descriptionKey: "mcp.tools.encode" },
  { name: "get_encode_qr_bulk", descriptionKey: "mcp.tools.encodeBulk" },
] as const;

const MCP_EXPORT_DEFAULTS = [
  "mcp.export.layout",
  "mcp.export.ratio",
  "mcp.export.style",
  "mcp.export.format",
] as const;

const INSTALL_JSON = `{
  "mcpServers": {
    "tukarqr": {
      "url": "${MCP_ENDPOINT}"
    }
  }
}`;

export function McpContent() {
  const t = useT();
  const [endpointCopied, setEndpointCopied] = useState(false);
  const [installCopied, setInstallCopied] = useState(false);

  async function copyText(text: string, setCopied: (value: boolean) => void) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <main className="bg-background px-4 py-8 sm:py-12">
      <div className="mx-auto max-w-[800px] w-full space-y-6 text-[15px] leading-[1.7] text-foreground">
        <PageBackButton className="-ml-2" />
        <h1 className="text-xl font-semibold">{t("mcp.heading")}</h1>

        <p>{t("mcp.intro")}</p>

        <div className="space-y-2">
          <label
            htmlFor="mcp-endpoint"
            className="text-sm text-muted-foreground"
          >
            {t("mcp.endpoint.label")}
          </label>
          <div className="flex flex-wrap items-center gap-2">
            <input
              id="mcp-endpoint"
              type="text"
              readOnly
              value={MCP_ENDPOINT}
              size={MCP_ENDPOINT.length}
              className="h-9 w-fit max-w-full rounded-md border border-input bg-background px-3 font-mono text-[13px] text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
              onFocus={(e) => e.currentTarget.select()}
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="shrink-0"
              onClick={() => copyText(MCP_ENDPOINT, setEndpointCopied)}
            >
              <Icon icon={Copy01Icon} size={14} className="size-3.5" />
              {endpointCopied
                ? t("mcp.install.copied")
                : t("mcp.install.copy")}
            </Button>
          </div>
        </div>

        <p className="text-muted-foreground">{t("mcp.privacy")}</p>

        <section aria-labelledby="mcp-tools-heading">
          <h2 id="mcp-tools-heading" className="text-base font-semibold">
            {t("mcp.tools.heading")}
          </h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {MCP_TOOLS.map((tool) => (
              <article
                key={tool.name}
                className="rounded-xl border border-border bg-muted/30 px-4 py-3.5"
              >
                <h3 className="font-mono text-[13px] font-medium leading-snug text-primary">
                  {tool.name}
                </h3>
                <p className="mt-1.5 text-[14px] leading-relaxed text-muted-foreground">
                  {t(tool.descriptionKey)}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section
          className="rounded-xl border border-border bg-muted/30 px-4 py-4 sm:px-5"
          aria-labelledby="mcp-export-heading"
        >
          <h2
            id="mcp-export-heading"
            className="text-base font-semibold text-foreground"
          >
            {t("mcp.export.heading")}
          </h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-[14px] leading-relaxed text-muted-foreground">
            {MCP_EXPORT_DEFAULTS.map((key) => (
              <li key={key}>{t(key)}</li>
            ))}
          </ul>
          <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
            {t("mcp.export.note")}
          </p>
        </section>

        <section
          className="rounded-xl border border-border bg-muted/30 px-4 py-4 sm:px-5"
          aria-labelledby="mcp-install-heading"
        >
          <div className="flex items-start justify-between gap-3">
            <h2
              id="mcp-install-heading"
              className="text-base font-semibold text-foreground"
            >
              {t("mcp.install.heading")}
            </h2>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => copyText(INSTALL_JSON, setInstallCopied)}
            >
              <Icon icon={Copy01Icon} size={14} className="size-3.5" />
              {installCopied
                ? t("mcp.install.copied")
                : t("mcp.install.copy")}
            </Button>
          </div>
          <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
            {t("mcp.install.body")}
          </p>
          <pre className="mt-3 overflow-x-auto rounded-lg bg-background px-3 py-3 font-mono text-[13px] leading-relaxed">
            {INSTALL_JSON}
          </pre>
          <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
            {t("mcp.install.claude")}
          </p>
        </section>

        <p>
          <a
            href={MCP_GITHUB_README}
            className="underline underline-offset-4"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("mcp.docs.github")}
          </a>
        </p>
      </div>
    </main>
  );
}
