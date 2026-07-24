"use client";

import { motion } from "framer-motion";

import { Button, actionButtonClassName } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import type { QrExportLayout } from "@/lib/qr-render";
import { useT } from "@/lib/i18n";
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
  showBankNameId = "show-bank-name",
}: QrExportConfigFormProps) {
  const t = useT();
  const gridButtonClassName = cn(
    actionButtonClassName,
    "flex flex-col items-center justify-center gap-0.5"
  );
  const isPlain = exportLayout === "plain";

  return (
    <div className="flex w-full flex-col gap-5">
      <div className="flex w-full flex-col gap-2">
        <label className="text-sm font-medium">{t("export.form.layout.label")}</label>
        <div className="grid w-full grid-cols-2 gap-2">
          <motion.div
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="min-w-0"
          >
            <Button
              size="lg"
              variant={exportLayout === "duitnow" ? "default" : "outline"}
              className={cn("w-full min-w-0", gridButtonClassName)}
              onClick={() => onExportLayoutChange("duitnow")}
            >
              <span className="font-medium text-sm">{t("export.form.layout.duitnow")}</span>
            </Button>
          </motion.div>
          <motion.div
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="min-w-0"
          >
            <Button
              size="lg"
              variant={exportLayout === "plain" ? "default" : "outline"}
              className={cn("w-full min-w-0", gridButtonClassName)}
              onClick={() => onExportLayoutChange("plain")}
            >
              <span className="font-medium text-sm">{t("export.form.layout.plain")}</span>
            </Button>
          </motion.div>
        </div>
        {isPlain && (
          <p className="text-xs text-muted-foreground">
            {t("export.form.layout.plainHint")}
          </p>
        )}
      </div>

      <div className="flex w-full flex-col gap-2">
        <label className="text-sm font-medium">{t("export.form.style.label")}</label>
        <div className="grid w-full grid-cols-2 gap-2">
          <motion.div
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="min-w-0"
          >
            <Button
              size="lg"
              variant={qrStyle === "classic" ? "default" : "outline"}
              className={cn("w-full min-w-0", gridButtonClassName)}
              onClick={() => onQrStyleChange("classic")}
            >
              <span className="font-medium text-sm">{t("export.form.style.classic")}</span>
            </Button>
          </motion.div>
          <motion.div
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="min-w-0"
          >
            <Button
              size="lg"
              variant={qrStyle === "rounded" ? "default" : "outline"}
              className={cn("w-full min-w-0", gridButtonClassName)}
              onClick={() => onQrStyleChange("rounded")}
            >
              <span className="font-medium text-sm">{t("export.form.style.rounded")}</span>
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
              {t("export.form.showBankName")}
            </label>
            <Switch
              id={showBankNameId}
              checked={showBankName}
              onCheckedChange={onShowBankNameChange}
            />
          </div>
          <div className="flex w-full flex-col gap-2">
            <label className="text-sm font-medium">{t("export.form.bg.label")}</label>
            <div className="grid w-full grid-cols-2 gap-2">
              <motion.div
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="min-w-0"
              >
                <Button
                  size="lg"
                  variant={outerBg === "white" ? "default" : "outline"}
                  className={cn("w-full min-w-0", gridButtonClassName)}
                  onClick={() => onOuterBgChange("white")}
                >
                  <span className="font-medium">{t("export.form.bg.white")}</span>
                </Button>
              </motion.div>
              <motion.div
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="min-w-0"
              >
                <Button
                  size="lg"
                  variant={outerBg === "transparent" ? "default" : "outline"}
                  className={cn("w-full min-w-0", gridButtonClassName)}
                  onClick={() => onOuterBgChange("transparent")}
                >
                  <span className="font-medium">{t("export.form.bg.transparent")}</span>
                </Button>
              </motion.div>
            </div>
          </div>
          <div className="flex w-full flex-col gap-2">
            <label className="text-sm font-medium">{t("export.form.ratio.label")}</label>
            <div className="grid w-full grid-cols-2 gap-2">
              <motion.div
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="min-w-0"
              >
                <Button
                  size="lg"
                  variant={exportRatio === "1:1" ? "default" : "outline"}
                  className={cn("w-full min-w-0", gridButtonClassName)}
                  onClick={() => onExportRatioChange("1:1")}
                >
                  <span className="font-medium">{t("export.form.ratio.1_1")}</span>
                </Button>
              </motion.div>
              <motion.div
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="min-w-0"
              >
                <Button
                  size="lg"
                  variant={exportRatio === "3:4" ? "default" : "outline"}
                  className={cn("w-full min-w-0", gridButtonClassName)}
                  onClick={() => onExportRatioChange("3:4")}
                >
                  <span className="font-medium">{t("export.form.ratio.3_4")}</span>
                </Button>
              </motion.div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
