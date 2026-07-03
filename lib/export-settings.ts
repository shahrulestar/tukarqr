import type { QrExportLayout } from "@/lib/qr-render";

const STORAGE_KEY = "tukarqr-export-settings";

export interface ExportSettings {
  exportLayout: QrExportLayout;
  qrStyle: "classic" | "rounded";
  showBankName: boolean;
  outerBg: "white" | "transparent";
  exportRatio: "1:1" | "3:4";
}

const DEFAULTS: ExportSettings = {
  exportLayout: "duitnow",
  qrStyle: "classic",
  showBankName: true,
  outerBg: "white",
  exportRatio: "1:1",
};

function isValidSettings(value: unknown): value is ExportSettings {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    (v.exportLayout === "duitnow" || v.exportLayout === "plain") &&
    (v.qrStyle === "classic" || v.qrStyle === "rounded") &&
    typeof v.showBankName === "boolean" &&
    (v.outerBg === "white" || v.outerBg === "transparent") &&
    (v.exportRatio === "1:1" || v.exportRatio === "3:4")
  );
}

export function loadExportSettings(): ExportSettings {
  if (typeof window === "undefined") return { ...DEFAULTS };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULTS };
    const parsed: unknown = JSON.parse(raw);
    return isValidSettings(parsed) ? parsed : { ...DEFAULTS };
  } catch {
    return { ...DEFAULTS };
  }
}

export function saveExportSettings(settings: ExportSettings): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}
