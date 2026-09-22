"use client";

import { useState } from "react";
import { PageBackButton } from "@/components/page-back-button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  ArrowDown01Icon,
  ArrowUp01Icon,
  Copy01Icon,
  Icon,
} from "@/components/ui/icon";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useT } from "@/lib/i18n";

const MCP_ENDPOINT = "https://mcp.tukarqr.my/mcp";
const MCP_GITHUB_README =
  "https://github.com/shahrulestar/tukarqr/blob/main/mcp/README.md";

/** EMVCo payload from public/comparison-after.png (about page example QR). */
const ABOUT_SAMPLE_PAYLOAD =
  "00020201021126420014A000000615000101066033460210MD001675755204866153034585802MY5925MASJID AN NUR KG PULAU PA6002MY62730325176058824920300364503190705201760588252660003807507161760587771148005630470BF";

const SAMPLE_PROMPT_PARAMS = { payload: ABOUT_SAMPLE_PAYLOAD };

const MCP_TOOLS = [
  { name: "get_validate_duitnow_qr", descriptionKey: "mcp.tools.validate" },
  { name: "get_parse_duitnow_qr", descriptionKey: "mcp.tools.parse" },
  { name: "get_duitnow_qr_details", descriptionKey: "mcp.tools.details" },
  { name: "get_decode_qr_image", descriptionKey: "mcp.tools.decodeImage" },
  { name: "get_decode_qr_images_bulk", descriptionKey: "mcp.tools.decodeBulk" },
  { name: "get_encode_qr", descriptionKey: "mcp.tools.encode" },
  { name: "get_encode_qr_bulk", descriptionKey: "mcp.tools.encodeBulk" },
  { name: "get_convert_qr_image", descriptionKey: "mcp.tools.convert" },
  { name: "get_convert_qr_images_bulk", descriptionKey: "mcp.tools.convertBulk" },
] as const;

const MCP_EXPORT_DEFAULTS = [
  "mcp.export.layout",
  "mcp.export.style",
  "mcp.export.showBank",
  "mcp.export.bg",
  "mcp.export.ratio",
  "mcp.export.format",
] as const;

const MCP_EXAMPLE_PROMPTS = [
  {
    id: "blurry",
    titleKey: "mcp.prompts.fullWorkflow.title",
    promptKey: "mcp.prompts.fullWorkflow.text",
  },
  {
    id: "old-photo",
    titleKey: "mcp.prompts.decodeImage.title",
    promptKey: "mcp.prompts.decodeImage.text",
  },
  {
    id: "snapshot",
    titleKey: "mcp.prompts.snapshot.title",
    promptKey: "mcp.prompts.snapshot.text",
  },
  {
    id: "decode-bulk",
    titleKey: "mcp.prompts.decodeBulk.title",
    promptKey: "mcp.prompts.decodeBulk.text",
  },
  {
    id: "heic",
    titleKey: "mcp.prompts.heic.title",
    promptKey: "mcp.prompts.heic.text",
  },
  {
    id: "validate-valid",
    titleKey: "mcp.prompts.validateValid.title",
    promptKey: "mcp.prompts.validateValid.text",
    params: SAMPLE_PROMPT_PARAMS,
  },
  {
    id: "validate-invalid",
    titleKey: "mcp.prompts.validateInvalid.title",
    promptKey: "mcp.prompts.validateInvalid.text",
  },
  {
    id: "validate-corrupt",
    titleKey: "mcp.prompts.validateCorrupt.title",
    promptKey: "mcp.prompts.validateCorrupt.text",
  },
  {
    id: "parse",
    titleKey: "mcp.prompts.parse.title",
    promptKey: "mcp.prompts.parse.text",
    params: SAMPLE_PROMPT_PARAMS,
  },
  {
    id: "details",
    titleKey: "mcp.prompts.details.title",
    promptKey: "mcp.prompts.details.text",
    params: SAMPLE_PROMPT_PARAMS,
  },
  {
    id: "encode-default",
    titleKey: "mcp.prompts.encodeDefault.title",
    promptKey: "mcp.prompts.encodeDefault.text",
    params: SAMPLE_PROMPT_PARAMS,
  },
  {
    id: "encode-custom",
    titleKey: "mcp.prompts.encodeCustom.title",
    promptKey: "mcp.prompts.encodeCustom.text",
    params: SAMPLE_PROMPT_PARAMS,
  },
  {
    id: "encode-bulk",
    titleKey: "mcp.prompts.encodeBulk.title",
    promptKey: "mcp.prompts.encodeBulk.text",
    params: SAMPLE_PROMPT_PARAMS,
  },
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
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);
  const [openPrompts, setOpenPrompts] = useState<string[]>([]);

  async function copyText(text: string, setCopied: (value: boolean) => void) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  async function copyPrompt(id: string, text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedPromptId(id);
      window.setTimeout(() => setCopiedPromptId(null), 2000);
    } catch {
      setCopiedPromptId(null);
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
          <div className="mt-3 overflow-x-auto rounded-xl border border-border [-webkit-overflow-scrolling:touch]">
            <Table className="min-w-[720px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[260px] px-4">
                    {t("mcp.tools.table.name")}
                  </TableHead>
                  <TableHead className="min-w-[420px] px-4">
                    {t("mcp.tools.table.description")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MCP_TOOLS.map((tool) => (
                  <TableRow key={tool.name}>
                    <TableCell className="min-w-[260px] px-4 align-top font-mono text-[13px] font-medium whitespace-nowrap text-primary">
                      {tool.name}
                    </TableCell>
                    <TableCell className="min-w-[420px] px-4 align-top whitespace-normal text-muted-foreground">
                      {t(tool.descriptionKey)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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

        <section
          className="rounded-xl border border-border bg-muted/30 px-4 py-4 sm:px-5"
          aria-labelledby="mcp-prompts-heading"
        >
          <h2
            id="mcp-prompts-heading"
            className="text-base font-semibold text-foreground"
          >
            {t("mcp.prompts.heading")}
          </h2>
          <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
            {t("mcp.prompts.body")}
          </p>
          <Accordion
            type="multiple"
            value={openPrompts}
            onValueChange={setOpenPrompts}
            className="mt-4 rounded-lg border border-border bg-background"
          >
            {MCP_EXAMPLE_PROMPTS.map((prompt, index) => {
              const isOpen = openPrompts.includes(prompt.id);
              const promptText = t(
                prompt.promptKey,
                "params" in prompt ? prompt.params : undefined
              );

              return (
                <AccordionItem
                  key={prompt.id}
                  value={prompt.id}
                  className={`data-open:bg-transparent ${index === MCP_EXAMPLE_PROMPTS.length - 1 ? "border-b-0" : ""}`}
                >
                  <AccordionTrigger className="gap-2 py-3 text-[14px] font-medium hover:no-underline sm:px-4 [&_[data-slot=accordion-trigger-icon]]:hidden">
                    <span className="min-w-0 flex-1 text-left">
                      {t(prompt.titleKey)}
                    </span>
                    {isOpen ? (
                      <Button asChild variant="secondary" size="sm">
                        <span
                          className="shrink-0"
                          onPointerDown={(event) => event.stopPropagation()}
                          onClick={(event) => {
                            event.stopPropagation();
                            copyPrompt(prompt.id, promptText);
                          }}
                        >
                          <Icon
                            icon={Copy01Icon}
                            size={14}
                            className="size-3.5"
                          />
                          {copiedPromptId === prompt.id
                            ? t("mcp.install.copied")
                            : t("mcp.install.copy")}
                        </span>
                      </Button>
                    ) : null}
                    <Icon
                      icon={isOpen ? ArrowUp01Icon : ArrowDown01Icon}
                      size={16}
                      className="size-4 shrink-0 text-muted-foreground"
                    />
                  </AccordionTrigger>
                  <AccordionContent className="px-3 pb-3 sm:px-4">
                    <pre className="overflow-x-auto whitespace-pre-wrap font-mono text-[13px] leading-relaxed text-muted-foreground">
                      {promptText}
                    </pre>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
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
