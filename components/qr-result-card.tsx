"use client";

import { useRef } from "react";
import { X, Settings } from "lucide-react";
import type { QrModuleStyle } from "@/components/qr-styled-svg";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { QrResultItem } from "@/components/qr-result-item";
import type { UploadItem } from "@/components/qr-upload-zone";
import {
  downloadAllQrsAsZip,
  type DownloadAllItem,
  type QrExportLayout,
} from "@/lib/qr-render";
import { parseEmvCoMerchantName, parseEmvCoBankName } from "@/lib/emvco";

interface QrResultListProps {
  resultCardRef: React.RefObject<HTMLDivElement | null>;
  results: (UploadItem & { payload: string })[];
  qrFgColor: string;
  qrStyle: QrModuleStyle;
  showBankName: boolean;
  outerBg: "white" | "transparent";
  exportRatio?: "1:1" | "3:4";
  exportLayout?: QrExportLayout;
  alertDismissed: boolean;
  onDismissAlert: () => void;
  onConfigOpen: () => void;
  disabled?: boolean;
  onExportSuccess?: () => void;
}

export function QrResultList({
  resultCardRef,
  results,
  qrFgColor,
  qrStyle,
  showBankName,
  outerBg,
  exportRatio = "1:1",
  exportLayout = "duitnow",
  alertDismissed,
  onDismissAlert,
  onConfigOpen,
  disabled = false,
  onExportSuccess,
}: QrResultListProps) {
  const svgRefsMap = useRef<Map<string, SVGSVGElement>>(new Map());

  function getDownloadItems(): DownloadAllItem[] {
    return results.map((r) => ({
      svg: svgRefsMap.current.get(r.id),
      merchantName: parseEmvCoMerchantName(r.payload),
      bankName: showBankName ? parseEmvCoBankName(r.payload) : null,
    }));
  }

  async function handleDownloadAll() {
    const items = getDownloadItems();
    const success = await downloadAllQrsAsZip(
      items,
      outerBg,
      exportRatio,
      exportLayout
    );
    if (success) onExportSuccess?.();
  }

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
          <div className="flex items-start justify-between gap-2">
            <div>
              <CardTitle className="text-[16px] md:text-[18px]">
                QR siap digunakan
              </CardTitle>
              <CardDescription className="text-[13px] md:text-[14px] leading-[1.55]">
                Imbas dengan app bank untuk bayar
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onConfigOpen}
              aria-label="Tetapkan reka bentuk QR"
            >
              <Settings className="size-4" />
            </Button>
          </div>
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

          <div className="space-y-3">
              {results.map((item) => (
              <QrResultItem
                key={item.id}
                id={item.id}
                payload={item.payload}
                fileName={item.file.name}
                qrFgColor={qrFgColor}
                qrStyle={qrStyle}
                showBankName={showBankName}
                outerBg={outerBg}
                exportRatio={exportRatio}
                exportLayout={exportLayout}
                svgRefCallback={(el) => {
                  if (el) svgRefsMap.current.set(item.id, el);
                }}
                disabled={disabled}
                onExportSuccess={onExportSuccess}
              />
            ))}
          </div>
          {results.length > 1 && (
            <Button
              variant="default"
              className="w-full"
              onClick={handleDownloadAll}
              disabled={disabled}
            >
              Muat turun semua ({results.length})
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
