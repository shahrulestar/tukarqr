import JSZip from "jszip";
import { toast } from "sonner";

export function formatShortFilename(merchantName: string | null): string {
  const now = new Date();
  const date = now.toISOString().slice(2, 10).replace(/-/g, "");
  const time = now.toTimeString().slice(0, 5).replace(":", "");
  const base =
    merchantName
      ? merchantName.replace(/[^a-zA-Z0-9\s]/g, "").slice(0, 20).trim() || "qr"
      : "qr";
  return `${base}_${date}_${time}.png`;
}

export function getPrimaryColor(): string {
  if (typeof window === "undefined") return "#000000";
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue("--primary")
    .trim();
  return value || "#000000";
}

const INNER_PADDING_TOP_BOTTOM = 24;
const INNER_PADDING_LEFT_RIGHT = 36;
const MALAYSIA_QR_BORDER_TOP = 20;
const MALAYSIA_QR_BORDER_LEFT_RIGHT = 20;
const MALAYSIA_QR_BORDER_BOTTOM = 12;
const MALAYSIA_QR_BAR_HEIGHT = 100;
const MALAYSIA_QR_RADIUS = 16;
const HOLDER_NAME_FONT = "600 44px system-ui, -apple-system, sans-serif";
const MAX_BANK_NAME_LENGTH = 45;
const WATERMARK_TEXT = "tukarqr.my";

export function renderSvgToPng(
  svgElement: SVGSVGElement,
  options?: {
    merchantName?: string | null;
    bankName?: string | null;
    includeText?: boolean;
    ratio?: "1:1" | "3:4";
    watermark?: boolean;
    outerBg?: "white" | "transparent";
  }
): Promise<string> {
  const merchantName = options?.merchantName ?? null;
  const bankName = options?.bankName
    ? options.bankName.slice(0, MAX_BANK_NAME_LENGTH)
    : null;
  const includeText = options?.includeText ?? false;
  const ratio = options?.ratio ?? "1:1";
  const watermark = options?.watermark ?? false;
  const outerBg = options?.outerBg ?? "white";

  return new Promise((resolve, reject) => {
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgData], {
      type: "image/svg+xml;charset=utf-8",
    });
    const url = URL.createObjectURL(svgBlob);
    const img = new Image();
    img.onload = () => {
      const borderTop = MALAYSIA_QR_BORDER_TOP;
      const borderLeft = MALAYSIA_QR_BORDER_LEFT_RIGHT;
      const borderRight = MALAYSIA_QR_BORDER_LEFT_RIGHT;
      const borderBottom = MALAYSIA_QR_BORDER_BOTTOM;
      const barHeight = MALAYSIA_QR_BAR_HEIGHT;
      const radius = MALAYSIA_QR_RADIUS;
      const holderNameArea =
        includeText && (merchantName || bankName)
          ? merchantName && bankName
            ? 110
            : 80
          : 0;

      const totalWidth = ratio === "1:1" ? 1000 : 900;
      const totalHeight =
        ratio === "1:1" ? 1000 : Math.round(totalWidth * (4 / 3));
      const contentLeft = INNER_PADDING_LEFT_RIGHT;
      const contentTop = INNER_PADDING_TOP_BOTTOM;
      const contentWidth = totalWidth - INNER_PADDING_LEFT_RIGHT * 2;
      const contentHeight = totalHeight - INNER_PADDING_TOP_BOTTOM * 2;
      const frameSize = Math.min(contentWidth, contentHeight);
      const frameX = contentLeft + (contentWidth - frameSize) / 2;
      const frameY = contentTop + (contentHeight - frameSize) / 2;

      const innerWidth = frameSize - borderLeft - borderRight;
      const whiteHeight = frameSize - borderTop - barHeight;

      const qrSize = Math.min(
        innerWidth - INNER_PADDING_TOP_BOTTOM * 2,
        whiteHeight - INNER_PADDING_TOP_BOTTOM * 2 - holderNameArea
      );
      const qrX = frameX + borderLeft + (innerWidth - qrSize) / 2;
      const qrY = frameY + borderTop + INNER_PADDING_TOP_BOTTOM;

      const canvas = document.createElement("canvas");
      canvas.width = totalWidth;
      canvas.height = totalHeight;
      const ctx = canvas.getContext("2d")!;

      const drawRoundedRect = (
        x: number,
        y: number,
        w: number,
        h: number,
        r: number
      ) => {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
      };

      if (outerBg === "white") {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, totalWidth, totalHeight);
      }

      const borderColor = getPrimaryColor();
      ctx.fillStyle = borderColor;
      drawRoundedRect(
        frameX,
        frameY,
        frameSize,
        frameSize,
        radius + Math.max(borderTop, borderLeft, borderRight, borderBottom)
      );
      ctx.fill();

      ctx.fillStyle = "#ffffff";
      drawRoundedRect(
        frameX + borderLeft,
        frameY + borderTop,
        innerWidth,
        whiteHeight,
        radius
      );
      ctx.fill();

      ctx.drawImage(img, qrX, qrY, qrSize, qrSize);

      if (includeText && (merchantName || bankName)) {
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#000000";
        ctx.font = HOLDER_NAME_FONT;
        const holderCenterX = frameX + borderLeft + innerWidth / 2;
        const holderTop = qrY + qrSize;
        if (merchantName && bankName) {
          ctx.fillText(merchantName, holderCenterX, holderTop + 22);
          ctx.fillText(
            bankName,
            holderCenterX,
            holderTop + 44 + 12 + 22
          );
        } else if (merchantName) {
          ctx.fillText(
            merchantName,
            holderCenterX,
            holderTop + holderNameArea / 2
          );
        } else if (bankName) {
          ctx.fillText(
            bankName,
            holderCenterX,
            holderTop + holderNameArea / 2
          );
        }
      }

      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = HOLDER_NAME_FONT;
      ctx.fillText(
        "MALAYSIA NATIONAL QR",
        frameX + borderLeft + innerWidth / 2,
        frameY + frameSize - barHeight / 2
      );

      if (watermark) {
        ctx.fillStyle = "rgba(0,0,0,0.25)";
        ctx.font = "12px system-ui, -apple-system, sans-serif";
        ctx.textAlign = "right";
        ctx.textBaseline = "bottom";
        ctx.fillText(WATERMARK_TEXT, totalWidth - 12, totalHeight - 8);
      }

      const dataUrl = canvas.toDataURL("image/png");
      URL.revokeObjectURL(url);
      resolve(dataUrl);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to render PNG"));
    };
    img.src = url;
  });
}

export function downloadQrAsPng(
  svgElement: SVGSVGElement,
  filename: string,
  merchantName?: string | null,
  bankName?: string | null,
  ratio?: "1:1" | "3:4",
  outerBg?: "white" | "transparent",
  onError?: () => void
) {
  renderSvgToPng(svgElement, {
    merchantName,
    bankName,
    includeText: true,
    ratio: ratio ?? "1:1",
    watermark: false,
    outerBg: outerBg ?? "white",
  })
    .then((dataUrl) => {
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    })
    .catch(() => {
      toast.error("Ralat", {
        description: "Gagal menjana imej QR. Sila cuba lagi.",
      });
      onError?.();
    });
}

export interface DownloadAllItem {
  svg: SVGSVGElement | undefined;
  merchantName: string | null;
  bankName: string | null;
}

export function downloadAllQrsAsPng(
  items: DownloadAllItem[],
  outerBg: "white" | "transparent" = "white"
) {
  const valid = items.filter((i) => i.svg);
  if (valid.length === 0) {
    toast.error("Ralat", {
      description: "Tiada imej QR tersedia untuk dimuat turun.",
    });
    return;
  }

  let successCount = 0;
  const baseDate = new Date()
    .toISOString()
    .slice(2, 10)
    .replace(/-/g, "");
  const baseTime = new Date().toTimeString().slice(0, 5).replace(":", "");

  async function downloadSequentially() {
    for (let index = 0; index < valid.length; index++) {
      const item = valid[index];
      if (!item.svg) continue;
      try {
        const base =
          item.merchantName
            ?.replace(/[^a-zA-Z0-9\s]/g, "")
            .slice(0, 20)
            .trim() || "qr";
        const filename = `${base}_${baseDate}_${baseTime}_${index + 1}.png`;
        const dataUrl = await renderSvgToPng(item.svg, {
          merchantName: item.merchantName,
          bankName: item.bankName,
          includeText: true,
          ratio: "1:1",
          watermark: false,
          outerBg,
        });
        const a = document.createElement("a");
        a.href = dataUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        successCount++;
        if (index < valid.length - 1) {
          await new Promise((r) => setTimeout(r, 150));
        }
      } catch {
        toast.error("Ralat", {
          description: "Gagal memuat turun imej QR ini. Sila cuba lagi.",
        });
      }
    }
    if (successCount > 0) {
      toast.success("Berjaya", {
        description: `${successCount} imej QR berjaya dimuat turun ke peranti anda.`,
      });
    }
  }
  downloadSequentially();
}

export async function downloadAllQrsAsZip(
  items: DownloadAllItem[],
  outerBg: "white" | "transparent" = "white",
  ratio: "1:1" | "3:4" = "1:1"
): Promise<void> {
  const valid = items.filter((i) => i.svg);
  if (valid.length === 0) {
    toast.error("Ralat", {
      description: "Tiada imej QR tersedia untuk dimuat turun.",
    });
    return;
  }

  const baseDate = new Date()
    .toISOString()
    .slice(2, 10)
    .replace(/-/g, "");
  const baseTime = new Date().toTimeString().slice(0, 5).replace(":", "");
  const zipFilename = `duitnow-qr_${baseDate}_${baseTime}.zip`;

  try {
    const zip = new JSZip();

    const results = await Promise.allSettled(
      valid.map(async (item, index) => {
        if (!item.svg) return null;
        const base =
          item.merchantName
            ?.replace(/[^a-zA-Z0-9\s]/g, "")
            .slice(0, 20)
            .trim() || "qr";
        const filename = `${base}_${baseDate}_${baseTime}_${index + 1}.png`;
        const dataUrl = await renderSvgToPng(item.svg, {
          merchantName: item.merchantName,
          bankName: item.bankName,
          includeText: true,
          ratio,
          watermark: false,
          outerBg,
        });
        const base64 = dataUrl.split(",")[1];
        if (!base64) throw new Error("Invalid data URL");
        return { filename, base64 };
      })
    );

    const succeeded = results.filter((r) => r.status === "fulfilled" && r.value);
    if (succeeded.length === 0) {
    toast.error("Ralat", {
      description: "Gagal menjana imej QR. Sila cuba lagi.",
    });
      return;
    }

    for (const r of succeeded) {
      if (r.status === "fulfilled" && r.value) {
        zip.file(r.value.filename, r.value.base64, { base64: true });
      }
    }

    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = zipFilename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success("Berjaya", {
      description: `${succeeded.length} imej QR berjaya dimuat turun sebagai fail ZIP.`,
    });
  } catch {
    toast.error("Ralat", {
      description: "Gagal menjana fail ZIP. Sila cuba lagi.",
    });
  }
}
