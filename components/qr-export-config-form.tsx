"use client";

import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import type { QrExportLayout } from "@/lib/qr-render";
import { cn } from "@/lib/utils";

interface QrExportConfigFormProps {
  exportLayout: QrExportLayout;
  onExportLayoutChange: (layout: QrExportLayout) => void;
  qrStyle: "classic" | "rounded";
  onQrStyleChange: (style: "classic" | "rounded") => void;
  showBankName: boolean;
  onShowBankNameChange: (show: boolean) => void;
  outerBg: "white" | "transparent";
  onOuterBgChange: (bg: "white" | "transparent") => void;
  exportRatio: "1:1" | "3:4";
  onExportRatioChange: (ratio: "1:1" | "3:4") => void;
  drawerAction?: "download" | "copy" | null;
  onExecuteExport?: () => void;
  compact?: boolean;
  showBankNameId?: string;
}

export function QrExportConfigForm({
  exportLayout,
  onExportLayoutChange,
  qrStyle,
  onQrStyleChange,
  showBankName,
  onShowBankNameChange,
  outerBg,
  onOuterBgChange,
  exportRatio,
  onExportRatioChange,
  drawerAction,
  onExecuteExport,
  compact = false,
  showBankNameId = "show-bank-name",
}: QrExportConfigFormProps) {
  const gridBtnHeight = compact ? "h-[48px]" : "h-[64px]";
  const isPlain = exportLayout === "plain";

  return (
    <div className="flex w-full flex-col gap-5">
      <div className="flex w-full flex-col gap-2">
        <label className="text-sm font-medium">Format eksport</label>
        <div className="grid w-full grid-cols-2 gap-2">
          <motion.div
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="min-w-0"
          >
            <Button
              variant={exportLayout === "duitnow" ? "default" : "outline"}
              className={cn(
                "w-full min-w-0 flex flex-col items-center justify-center gap-0.5 px-2 py-3",
                gridBtnHeight
              )}
              onClick={() => onExportLayoutChange("duitnow")}
            >
              <span className="font-medium text-xs sm:text-sm">DuitNow</span>
            </Button>
          </motion.div>
          <motion.div
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="min-w-0"
          >
            <Button
              variant={exportLayout === "plain" ? "default" : "outline"}
              className={cn(
                "w-full min-w-0 flex flex-col items-center justify-center gap-0.5 px-2 py-3",
                gridBtnHeight
              )}
              onClick={() => onExportLayoutChange("plain")}
            >
              <span className="font-medium text-xs sm:text-sm">QR Sahaja</span>
            </Button>
          </motion.div>
        </div>
        {isPlain && (
          <p className="text-xs text-muted-foreground">
            Tiada nama penerima atau bank pada imej. Latar putih, nisbah 1:1.
          </p>
        )}
      </div>

      <div className="flex w-full flex-col gap-2">
        <label className="text-sm font-medium">Reka bentuk QR</label>
        <div className="grid w-full grid-cols-2 gap-2">
          <motion.div
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="min-w-0"
          >
            <Button
              variant={qrStyle === "classic" ? "default" : "outline"}
              className={cn(
                "w-full min-w-0 flex flex-col items-center justify-center gap-0.5 px-2 py-3",
                gridBtnHeight
              )}
              onClick={() => onQrStyleChange("classic")}
            >
              <span className="font-medium text-xs sm:text-sm">Petak</span>
            </Button>
          </motion.div>
          <motion.div
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="min-w-0"
          >
            <Button
              variant={qrStyle === "rounded" ? "default" : "outline"}
              className={cn(
                "w-full min-w-0 flex flex-col items-center justify-center gap-0.5 px-2 py-3",
                gridBtnHeight
              )}
              onClick={() => onQrStyleChange("rounded")}
            >
              <span className="font-medium text-xs sm:text-sm">Bulat</span>
            </Button>
          </motion.div>
        </div>
      </div>

      {!isPlain && (
        <>
          <div className="flex w-full items-center justify-between gap-4">
            <label
              htmlFor={showBankNameId}
              className="text-sm font-medium shrink-0"
            >
              Papar nama bank
            </label>
            <Switch
              id={showBankNameId}
              checked={showBankName}
              onCheckedChange={onShowBankNameChange}
            />
          </div>
          <div className="flex w-full flex-col gap-2">
            <label className="text-sm font-medium">Latar belakang</label>
            <div className="grid w-full grid-cols-2 gap-2">
              <motion.div
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="min-w-0"
              >
                <Button
                  variant={outerBg === "white" ? "default" : "outline"}
                  className={cn(
                    "w-full min-w-0 flex flex-col items-center justify-center gap-0.5 px-2 py-3",
                    gridBtnHeight
                  )}
                  onClick={() => onOuterBgChange("white")}
                >
                  <span className="font-medium">Putih</span>
                </Button>
              </motion.div>
              <motion.div
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="min-w-0"
              >
                <Button
                  variant={outerBg === "transparent" ? "default" : "outline"}
                  className={cn(
                    "w-full min-w-0 flex flex-col items-center justify-center gap-0.5 px-2 py-3",
                    gridBtnHeight
                  )}
                  onClick={() => onOuterBgChange("transparent")}
                >
                  <span className="font-medium">Lutsinar</span>
                </Button>
              </motion.div>
            </div>
          </div>
          <div className="flex w-full flex-col gap-2">
            <label className="text-sm font-medium">Resolusi imej</label>
            <div className="grid w-full grid-cols-2 gap-2">
              <motion.div
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="min-w-0"
              >
                <Button
                  variant={exportRatio === "1:1" ? "default" : "outline"}
                  className={cn(
                    "w-full min-w-0 flex flex-col items-center justify-center gap-0.5 px-2 py-3",
                    gridBtnHeight
                  )}
                  onClick={() => onExportRatioChange("1:1")}
                >
                  <span className="font-medium">1:1</span>
                </Button>
              </motion.div>
              <motion.div
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="min-w-0"
              >
                <Button
                  variant={exportRatio === "3:4" ? "default" : "outline"}
                  className={cn(
                    "w-full min-w-0 flex flex-col items-center justify-center gap-0.5 px-2 py-3",
                    gridBtnHeight
                  )}
                  onClick={() => onExportRatioChange("3:4")}
                >
                  <span className="font-medium">3:4</span>
                </Button>
              </motion.div>
            </div>
          </div>
        </>
      )}

      {drawerAction && onExecuteExport && (
        <div className={cn("flex flex-col sm:flex-row gap-2", !compact && "pt-2")}>
          <Button
            onClick={onExecuteExport}
            className="w-full sm:flex-1 sm:min-w-0"
          >
            {drawerAction === "download" ? "Muat turun" : "Salin imej"}
          </Button>
        </div>
      )}
    </div>
  );
}
