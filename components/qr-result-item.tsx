"use client";

import { useRef, useCallback, useState, useEffect } from "react";
import { toast } from "sonner";

import { QrStyledSvg, type QrModuleStyle } from "@/components/qr-styled-svg";
import { QrExportActionBar } from "@/components/qr-export-action-bar";
import { ImagePreviewDialog } from "@/components/image-preview-dialog";
import {
  renderSvgToPng,
  buildPlainRenderOptions,
  buildDuitnowRenderOptions,
  type QrExportLayout,
} from "@/lib/qr-render";
import {
  runQrExportAction,
  type QrExportAction,
} from "@/lib/qr-export-actions";
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
  exportLayout?: QrExportLayout;
  svgRefCallback?: (el: SVGSVGElement | null) => void;
  disabled?: boolean;
  onExportSuccess?: () => void;
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
  exportLayout = "duitnow",
  svgRefCallback,
  disabled = false,
  onExportSuccess,
}: QrResultItemProps) {
  const qrSvgRef = useRef<SVGSVGElement>(null);
  const [loadingAction, setLoadingAction] = useState<QrExportAction | null>(
    null
  );

  const setRef = useCallback(
    (el: SVGSVGElement | null) => {
      (qrSvgRef as React.MutableRefObject<SVGSVGElement | null>).current = el;
      svgRefCallback?.(el);
    },
    [svgRefCallback]
  );

  const merchantName = parseEmvCoMerchantName(payload);
  const bankName = parseEmvCoBankName(payload);

  function getRenderOptions() {
    return exportLayout === "plain"
      ? buildPlainRenderOptions()
      : buildDuitnowRenderOptions(
          merchantName,
          bankName,
          showBankName,
          exportRatio,
          outerBg
        );
  }

  async function handleExportAction(action: QrExportAction) {
    const svg = qrSvgRef.current;
    if (!svg || loadingAction) return;

    setLoadingAction(action);

    try {
      await runQrExportAction(action, svg, getRenderOptions(), merchantName);
      onExportSuccess?.();
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      if (action === "copy") {
        toast.error("Gagal salin", {
          description: "Sila gunakan muat turun sebagai alternatif.",
        });
      } else if (action === "share") {
        toast.error("Gagal kongsi", {
          description: "Sila gunakan muat turun sebagai alternatif.",
        });
      }
    } finally {
      setLoadingAction(null);
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
    renderSvgToPng(svg, getRenderOptions())
      .then((url) => {
        setPreviewUrl(url);
        setPreviewLoading(false);
      })
      .catch(() => setPreviewLoading(false));
  }, [previewOpen, merchantName, bankName, showBankName, outerBg, exportRatio, exportLayout]);

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
          <div onClick={(e) => e.stopPropagation()}>
            <QrExportActionBar
              onDownload={() => handleExportAction("download")}
              onCopy={() => handleExportAction("copy")}
              onShare={() => handleExportAction("share")}
              isLoading={loadingAction !== null}
              loadingAction={loadingAction}
              disabled={disabled}
            />
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
