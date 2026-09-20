export const MAX_BATCH_SIZE = 10;
export const NATIONAL_QR_LABEL = "MALAYSIA NATIONAL QR";
/** TukarQR primary magenta — matches web preview / comparison-after.png */
export const PRIMARY_MAGENTA = "#ec4899";

export type QrExportLayout = "duitnow" | "plain";
export type QrModuleStyle = "classic" | "rounded";
export type QrExportRatio = "1:1" | "3:4";
export type QrOuterBg = "white" | "transparent";
export type QrEncodeFormat = "png" | "svg";

export interface QrExportOptions {
  layout: QrExportLayout;
  ratio: QrExportRatio;
  qrStyle: QrModuleStyle;
  outerBg: QrOuterBg;
  showBankName: boolean;
  format: QrEncodeFormat;
  merchantName: string | null;
  bankName: string | null;
}

export const DEFAULT_EXPORT_OPTIONS: Omit<
  QrExportOptions,
  "merchantName" | "bankName"
> = {
  layout: "duitnow",
  ratio: "1:1",
  qrStyle: "classic",
  outerBg: "white",
  showBankName: true,
  format: "png",
};

export function resolveExportOptions(
  input: Partial<QrExportOptions> & { payload?: string }
): QrExportOptions {
  return {
    ...DEFAULT_EXPORT_OPTIONS,
    layout: input.layout ?? DEFAULT_EXPORT_OPTIONS.layout,
    ratio: input.ratio ?? DEFAULT_EXPORT_OPTIONS.ratio,
    qrStyle: input.qrStyle ?? DEFAULT_EXPORT_OPTIONS.qrStyle,
    outerBg: input.outerBg ?? DEFAULT_EXPORT_OPTIONS.outerBg,
    showBankName: input.showBankName ?? DEFAULT_EXPORT_OPTIONS.showBankName,
    format: input.format ?? DEFAULT_EXPORT_OPTIONS.format,
    merchantName: input.merchantName ?? null,
    bankName: input.bankName ?? null,
  };
}

export function formatExportFilename(merchantName: string | null): string {
  const now = new Date();
  const date = now.toISOString().slice(2, 10).replace(/-/g, "");
  const time = now.toTimeString().slice(0, 5).replace(":", "");
  const base =
    merchantName
      ?.replace(/[^a-zA-Z0-9\s]/g, "")
      .slice(0, 20)
      .trim() || "qr";
  return `${base}_${date}_${time}.png`;
}
