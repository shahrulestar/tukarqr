"use client";

import { QRCodeSVG } from "qrcode.react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface QrResultCardProps {
  resultCardRef: React.RefObject<HTMLDivElement | null>;
  qrSvgRef: React.RefObject<SVGSVGElement | null>;
  qrPayload: string;
  pngPreviewUrl: string | null;
  qrFgColor: string;
  merchantName: string | null;
  bankName: string | null;
  merchantAmount: string | null;
  alertDismissed: boolean;
  onDismissAlert: () => void;
  onDownload: () => void;
  onCopy: () => void;
}

export function QrResultCard({
  resultCardRef,
  qrSvgRef,
  qrPayload,
  pngPreviewUrl,
  qrFgColor,
  merchantName,
  bankName,
  merchantAmount,
  alertDismissed,
  onDismissAlert,
  onDownload,
  onCopy,
}: QrResultCardProps) {
  return (
    <div
      ref={resultCardRef}
      className="animate-in fade-in slide-in-from-bottom-4 duration-300"
      role="region"
      aria-label="Keputusan QR"
      aria-live="polite"
      tabIndex={-1}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-[16px] md:text-[18px]">
            DuitNow QR Sedia Digunakan
          </CardTitle>
          <CardDescription className="text-[13px] md:text-[14px] leading-[1.55]">
            Imbas dengan aplikasi bank anda untuk bayar.
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
                <li>Jangan imbasan QR dari sumber tidak dipercayai</li>
              </ul>
              <p className="mt-2 pt-2 border-t border-amber-500/30 text-[11px] text-muted-foreground">
                Alat ini hanya untuk kegunaan menukar DuitNow QR yang kabur atau
                gambar QR, kepada gambar yang jelas. Jangan gunakan untuk
                penipuan atau aktiviti haram. Pengguna bertanggungjawab
                sepenuhnya atas penggunaan alat ini.
              </p>
            </div>
          )}

          <div className="flex w-full flex-col items-center gap-2">
            <div className="rounded-lg bg-card border border-border pt-5 px-6 pb-4 select-none">
              <div className="relative inline-block">
                <QRCodeSVG
                  ref={qrSvgRef}
                  value={qrPayload}
                  size={280}
                  level="M"
                  marginSize={2}
                  fgColor={qrFgColor}
                  bgColor="#ffffff"
                  title="DuitNow QR - Imbas untuk bayar"
                  className={pngPreviewUrl ? "sr-only" : undefined}
                  aria-hidden={!!pngPreviewUrl}
                />
                {pngPreviewUrl && (
                  <img
                    src={pngPreviewUrl}
                    alt="DuitNow QR - Imbas untuk bayar"
                    className="max-w-[320px] w-full aspect-square object-contain pointer-events-none"
                    loading="lazy"
                    draggable={false}
                    onDragStart={(e) => e.preventDefault()}
                  />
                )}
              </div>
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
            <span className="text-[12px] leading-[1.45] tracking-[0.02em] text-muted-foreground">
              Serasi dengan DuitNow dan semua aplikasi bank Malaysia
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <Button onClick={onDownload} className="w-full">
              Muat Turun
            </Button>
            <Button onClick={onCopy} variant="outline" className="w-full">
              Salin Imej
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
