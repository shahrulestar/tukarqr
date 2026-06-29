"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { QrStyledSvg, type QrModuleStyle } from "@/components/qr-styled-svg";
import { Button } from "@/components/ui/button";
import { ImagePreviewDialog } from "@/components/image-preview-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  renderSvgToPng,
  buildPlainRenderOptions,
  buildDuitnowRenderOptions,
  type QrExportLayout,
} from "@/lib/qr-render";
import {
  parseEmvCoMerchantName,
  parseEmvCoBankName,
  parseEmvCoAmount,
} from "@/lib/emvco";

interface QrResultCardSingleProps {
  resultCardRef: React.RefObject<HTMLDivElement | null>;
  qrPayload: string;
  qrFgColor: string;
  qrStyle: QrModuleStyle;
  showBankName: boolean;
  outerBg: "white" | "transparent";
  exportRatio?: "1:1" | "3:4";
  exportLayout?: QrExportLayout;
  alertDismissed: boolean;
  onDismissAlert: () => void;
  onDownload: () => void;
  onCopy: () => void;
  svgRefCallback?: (el: SVGSVGElement | null) => void;
  disabled?: boolean;
}

export function QrResultCardSingle({
  resultCardRef,
  qrPayload,
  qrFgColor,
  qrStyle,
  showBankName,
  outerBg,
  exportRatio = "1:1",
  exportLayout = "duitnow",
  alertDismissed,
  onDismissAlert,
  onDownload,
  onCopy,
  svgRefCallback,
  disabled = false,
}: QrResultCardSingleProps) {
  const qrSvgRef = useRef<SVGSVGElement>(null);
  const [pngPreviewUrl, setPngPreviewUrl] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const merchantName = parseEmvCoMerchantName(qrPayload);
  const bankName = parseEmvCoBankName(qrPayload);
  const merchantAmount = parseEmvCoAmount(qrPayload);

  const setSvgRef = useCallback(
    (el: SVGSVGElement | null) => {
      (qrSvgRef as React.MutableRefObject<SVGSVGElement | null>).current = el;
      svgRefCallback?.(el);
    },
    [svgRefCallback]
  );

  useEffect(() => {
    if (!qrPayload || !qrSvgRef.current) {
      setPngPreviewUrl(null);
      return;
    }
    const svg = qrSvgRef.current;
    const timer = requestAnimationFrame(() => {
      const renderOptions =
        exportLayout === "plain"
          ? buildPlainRenderOptions()
          : buildDuitnowRenderOptions(
              merchantName,
              bankName,
              showBankName,
              exportRatio,
              outerBg
            );
      renderSvgToPng(svg, renderOptions)
        .then(setPngPreviewUrl)
        .catch(() => setPngPreviewUrl(null));
    });
    return () => {
      cancelAnimationFrame(timer);
      setPngPreviewUrl(null);
    };
  }, [qrPayload, merchantName, bankName, showBankName, qrStyle, outerBg, exportRatio, exportLayout]);

  return (
    <div
      ref={resultCardRef}
      role="region"
      aria-label="Keputusan QR"
      aria-live="polite"
      tabIndex={-1}
      className="[transform:translateZ(0)] [contain:layout_style_paint]"
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-[16px] md:text-[18px]">
            QR siap digunakan
          </CardTitle>
          <CardDescription className="text-[13px] md:text-[14px] leading-[1.55]">
            Imbas dengan app bank untuk bayar
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!alertDismissed && (
            <div
              role="alert"
              className="relative rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2.5 pr-9 text-[13px] text-amber-700 dark:text-amber-400 dark:border-amber-500/30 dark:bg-amber-500/10"
            >
              <button
                type="button"
                onClick={onDismissAlert}
                aria-label="Sembunyikan peringatan"
                className="absolute right-2 top-2 rounded p-1 text-amber-600 hover:bg-amber-500/20 dark:text-amber-400 dark:hover:bg-amber-500/20"
              >
                <X className="size-4" />
              </button>
              <p className="font-medium">Pastikan sebelum imbasan:</p>
              <ul className="mt-1 list-inside list-disc space-y-0.5 text-muted-foreground">
                <li>Sahkan nama penerima betul</li>
                <li>Semak jumlah bayaran jika ada</li>
                <li>Jangan imbas QR dari sumber yang tidak dipercayai</li>
              </ul>
            </div>
          )}

          <div className="flex w-full flex-col items-center gap-2">
            <div
              role="button"
              tabIndex={pngPreviewUrl && !disabled ? 0 : -1}
              onClick={() => pngPreviewUrl && !disabled && setPreviewOpen(true)}
              onKeyDown={(e) => {
                if (
                  pngPreviewUrl &&
                  !disabled &&
                  (e.key === "Enter" || e.key === " ")
                ) {
                  e.preventDefault();
                  setPreviewOpen(true);
                }
              }}
              aria-label="Pratonton QR"
              className="relative inline-block w-[280px] h-[280px] min-w-[280px] min-h-[280px] cursor-pointer rounded-lg transition-opacity hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-default disabled:opacity-100"
            >
              <QrStyledSvg
                ref={setSvgRef}
                value={qrPayload}
                size={280}
                style={qrStyle}
                level="M"
                marginSize={2}
                fgColor={qrFgColor}
                bgColor="#ffffff"
                title="DuitNow QR - Imbas untuk bayar"
                className={pngPreviewUrl ? "sr-only" : undefined}
                aria-hidden={!!pngPreviewUrl}
              />
              {pngPreviewUrl ? (
                <img
                  src={pngPreviewUrl}
                  alt="DuitNow QR - Imbas untuk bayar"
                  className="absolute inset-0 w-full h-full object-contain [-webkit-touch-callout:default] [-webkit-user-select:auto] [user-select:auto]"
                  loading="lazy"
                />
              ) : qrPayload ? (
                <div
                  className="absolute inset-0 bg-muted rounded-lg animate-pulse"
                  aria-hidden
                />
              ) : null}
            </div>
            {(merchantName || bankName) && (
              <div className="flex w-full min-w-0 flex-col gap-0.5 items-center">
                {merchantName && (
                  <p className="w-full min-w-0 break-words text-[18px] font-semibold text-foreground text-center">
                    {merchantName}
                  </p>
                )}
                {bankName && (
                  <p className="w-full min-w-0 break-words text-[18px] font-semibold text-foreground text-center">
                    {bankName}
                  </p>
                )}
              </div>
            )}
            {merchantAmount && (
              <p className="text-[16px] md:text-[18px] font-medium text-foreground">
                {merchantAmount}
              </p>
            )}
            <span className="block w-full text-center text-balance text-[12px] leading-[1.45] tracking-[0.02em] text-muted-foreground">
              Muat turun, salin, atau tekan & tahan QR di atas untuk simpan
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              onClick={onDownload}
              className="w-full sm:flex-1 sm:min-w-0"
              disabled={disabled}
            >
              Muat turun
            </Button>
            <Button
              onClick={onCopy}
              variant="outline"
              className="w-full sm:flex-1 sm:min-w-0"
              disabled={disabled}
            >
              Salin imej
            </Button>
          </div>
        </CardContent>
      </Card>
      <ImagePreviewDialog
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        src={pngPreviewUrl}
        alt={`DuitNow QR - ${merchantName || "Imbas untuk bayar"}`}
      />
    </div>
  );
}
