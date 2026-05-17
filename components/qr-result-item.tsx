"use client";

import { useRef, useCallback, useState, useEffect } from "react";
import { toast } from "sonner";
import { Download, Copy } from "lucide-react";

import { QrStyledSvg, type QrModuleStyle } from "@/components/qr-styled-svg";
import { Button } from "@/components/ui/button";
import { ImagePreviewDialog } from "@/components/image-preview-dialog";
import {
  formatShortFilename,
  renderSvgToPng,
  downloadQrAsPng,
} from "@/lib/qr-render";
import { copyQrImageToClipboard } from "@/lib/clipboard-utils";
import { cn } from "@/lib/utils";
import { parseEmvCoMerchantName, parseEmvCoBankName } from "@/lib/emvco";

interface QrResultItemProps {
  id: string;
  payload: string;
  fileName: string;
  qrFgColor: string;
  qrStyle: QrModuleStyle;
  showBankName: boolean;
  outerBg: "white" | "transparent";
  exportRatio?: "1:1" | "3:4";
  svgRefCallback?: (el: SVGSVGElement | null) => void;
  disabled?: boolean;
}

export function QrResultItem({
  id,
  payload,
  fileName,
  qrFgColor,
  qrStyle,
  showBankName,
  outerBg,
  exportRatio = "1:1",
  svgRefCallback,
  disabled = false,
}: QrResultItemProps) {
  const qrSvgRef = useRef<SVGSVGElement>(null);

  const setRef = useCallback(
    (el: SVGSVGElement | null) => {
      (qrSvgRef as React.MutableRefObject<SVGSVGElement | null>).current = el;
      svgRefCallback?.(el);
    },
    [svgRefCallback]
  );

  const merchantName = parseEmvCoMerchantName(payload);
  const bankName = parseEmvCoBankName(payload);

  function handleDownload() {
    const svg = qrSvgRef.current;
    if (!svg) return;
    const filename = formatShortFilename(merchantName);
    downloadQrAsPng(
      svg,
      filename,
      merchantName,
      showBankName ? bankName : null,
      exportRatio,
      outerBg,
      () => {}
    );
    toast.success("Berjaya", {
      description: "Imej QR berjaya dimuat turun ke peranti anda.",
    });
  }

  async function handleCopy() {
    const svg = qrSvgRef.current;
    if (!svg) return;
    try {
      await copyQrImageToClipboard(svg, {
        merchantName,
        bankName: showBankName ? bankName : null,
        includeText: true,
        ratio: exportRatio,
        watermark: false,
        outerBg,
      });
      toast.success("Berjaya", {
        description: "Imej QR berjaya disalin ke papan keratan.",
      });
    } catch {
      toast.error("Ralat", {
        description: "Gagal menyalin imej ke papan keratan. Sila gunakan Muat Turun sebagai alternatif.",
      });
    }
  }

  const displayName = merchantName || fileName;
  const truncatedName =
    displayName.length > 28 ? `${displayName.slice(0, 25)}...` : displayName;

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  useEffect(() => {
    if (!previewOpen) {
      setPreviewUrl(null);
      setPreviewLoading(false);
      return;
    }
    const svg = qrSvgRef.current;
    if (!svg) {
      setPreviewLoading(false);
      return;
    }
    setPreviewLoading(true);
    renderSvgToPng(svg, {
      merchantName,
      bankName: showBankName ? bankName : null,
      includeText: true,
      ratio: exportRatio,
      watermark: false,
      outerBg,
    })
      .then((url) => {
        setPreviewUrl(url);
        setPreviewLoading(false);
      })
      .catch(() => setPreviewLoading(false));
  }, [previewOpen, merchantName, bankName, showBankName, outerBg, exportRatio]);

  function handlePreviewClick() {
    if (!disabled) setPreviewOpen(true);
  }

  function handlePreviewKeyDown(e: React.KeyboardEvent) {
    if (!disabled && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      setPreviewOpen(true);
    }
  }

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={handlePreviewClick}
        onKeyDown={handlePreviewKeyDown}
        className={cn(
          "flex flex-col gap-3 rounded-lg border border-border bg-muted/30 p-3 cursor-pointer min-h-[120px] md:min-h-0",
          disabled && "cursor-not-allowed opacity-70"
        )}
        aria-label={`Pratonton QR - ${displayName}`}
      >
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <div
              className={cn(
                "flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-white p-1",
                disabled && "opacity-50"
              )}
            >
              <QrStyledSvg
                value={payload}
                size={40}
                style="classic"
                level="M"
                marginSize={1}
                fgColor="#ec4899"
                bgColor="#ffffff"
                className="pointer-events-none"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p
                className="truncate text-[14px] sm:text-[15px] md:text-base font-medium text-foreground"
                title={displayName}
              >
                {truncatedName}
              </p>
              {bankName && (
                <p className="truncate text-[12px] sm:text-[13px] md:text-sm text-muted-foreground">
                  {bankName}
                </p>
              )}
            </div>
          </div>
          <div
            className="flex w-full shrink-0 gap-2 md:w-auto md:ml-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              size="icon-sm"
              variant="ghost"
              className="flex-1 md:flex-none"
              onClick={handleDownload}
              disabled={disabled}
              aria-label="Muat Turun"
            >
              <Download className="size-4" />
            </Button>
            <Button
              size="icon-sm"
              variant="ghost"
              className="flex-1 md:flex-none"
              onClick={handleCopy}
              disabled={disabled}
              aria-label="Salin"
            >
              <Copy className="size-4" />
            </Button>
          </div>
        </div>
        <div className="sr-only" aria-hidden>
          <QrStyledSvg
            ref={setRef}
            value={payload}
            size={280}
            style={qrStyle}
            level="M"
            marginSize={2}
            fgColor={qrFgColor}
            bgColor="#ffffff"
          />
        </div>
    </div>
    <ImagePreviewDialog
      open={previewOpen}
      onOpenChange={setPreviewOpen}
      src={previewUrl}
      alt={`DuitNow QR - ${displayName}`}
      isLoading={previewLoading}
    />
    </>
  );
}
