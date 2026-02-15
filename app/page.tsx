"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import jsQR from "jsqr";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "sonner";
import {
  RefreshCw,
  QrCode,
  ImageIcon,
  Scan,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/use-media-query";
import { ResponsiveModal } from "@/components/responsive-modal";
import { HowToStart } from "@/components/onboarding/how-to-start";
import { PrivacyPolicy } from "@/components/onboarding/privacy-policy";

function decodeQrFromCanvas(canvas: HTMLCanvasElement): string | null {
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const result = jsQR(imageData.data, canvas.width, canvas.height, {
    inversionAttempts: "attemptBoth",
  });

  return result?.data || null;
}

async function decodeWithZxing(
  canvas: HTMLCanvasElement
): Promise<string | null> {
  try {
    const { BrowserQRCodeReader } = await import("@zxing/browser");
    const reader = new BrowserQRCodeReader();
    const result = await reader.decodeFromCanvas(canvas);
    return result?.getText() || null;
  } catch {
    return null;
  }
}

async function tryDecode(canvas: HTMLCanvasElement): Promise<string | null> {
  const jsQrResult = decodeQrFromCanvas(canvas);
  if (jsQrResult) return jsQrResult;
  return decodeWithZxing(canvas);
}

function tryDecodeAtScale(
  sourceCanvas: HTMLCanvasElement,
  scale: number,
  filter?: string
): Promise<string | null> {
  const w = Math.max(1, Math.round(sourceCanvas.width * scale));
  const h = Math.max(1, Math.round(sourceCanvas.height * scale));
  const temp = document.createElement("canvas");
  temp.width = w;
  temp.height = h;
  const ctx = temp.getContext("2d");
  if (!ctx) return Promise.resolve(null);

  if (filter) ctx.filter = filter;
  ctx.drawImage(sourceCanvas, 0, 0, sourceCanvas.width, sourceCanvas.height, 0, 0, w, h);
  ctx.filter = "none";

  return tryDecode(temp);
}

function applyContrastStretch(sourceCanvas: HTMLCanvasElement): HTMLCanvasElement {
  const ctx = sourceCanvas.getContext("2d");
  if (!ctx) return sourceCanvas;

  const imageData = ctx.getImageData(0, 0, sourceCanvas.width, sourceCanvas.height);
  const data = imageData.data;
  let min = 255;
  let max = 0;

  for (let i = 0; i < data.length; i += 4) {
    const luminance = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    min = Math.min(min, luminance);
    max = Math.max(max, luminance);
  }

  const range = max - min || 1;
  for (let i = 0; i < data.length; i += 4) {
    const luminance = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    const stretched = ((luminance - min) / range) * 255;
    data[i] = data[i + 1] = data[i + 2] = Math.round(stretched);
  }

  const temp = document.createElement("canvas");
  temp.width = sourceCanvas.width;
  temp.height = sourceCanvas.height;
  const tempCtx = temp.getContext("2d");
  if (!tempCtx) return sourceCanvas;
  tempCtx.putImageData(imageData, 0, 0);
  return temp;
}

async function preprocessAndDecode(
  sourceCanvas: HTMLCanvasElement,
  options?: { full?: boolean }
): Promise<string | null> {
  const full = options?.full ?? true;
  const scales = [1, 0.5, 0.2, 2];

  for (const scale of scales) {
    const result = await tryDecodeAtScale(sourceCanvas, scale);
    if (result) return result;
  }

  if (!full) {
    for (const scale of [0.2, 0.5]) {
      const result = await tryDecodeAtScale(sourceCanvas, scale, "blur(0.5px)");
      if (result) return result;
    }
    return null;
  }

  for (const scale of scales) {
    const result = await tryDecodeAtScale(sourceCanvas, scale, "blur(0.5px)");
    if (result) return result;
  }

  for (const scale of scales) {
    const temp = document.createElement("canvas");
    temp.width = Math.max(1, Math.round(sourceCanvas.width * scale));
    temp.height = Math.max(1, Math.round(sourceCanvas.height * scale));
    const ctx = temp.getContext("2d");
    if (!ctx) continue;
    ctx.drawImage(sourceCanvas, 0, 0, sourceCanvas.width, sourceCanvas.height, 0, 0, temp.width, temp.height);
    const stretched = applyContrastStretch(temp);
    const result = await tryDecode(stretched);
    if (result) return result;
  }

  return null;
}

const DUITNOW_MALAYSIA_AID = "A0000006150001";
const MAX_PAYLOAD_LENGTH = 5000;
const EMVCO_ASCII = /^[\x20-\x7E]*$/;

function parseEmvCoTlv(payload: string): Map<string, string> {
  const map = new Map<string, string>();
  let i = 0;
  while (i < payload.length - 4) {
    const id = payload.slice(i, i + 2);
    const lenStr = payload.slice(i + 2, i + 4);
    const len = parseInt(lenStr, 10);
    if (isNaN(len) || len < 0 || i + 4 + len > payload.length) break;
    const value = payload.slice(i + 4, i + 4 + len);
    map.set(id, value);
    i += 4 + len;
  }
  return map;
}

function getMerchantAccountAid(templateValue: string): string | null {
  let i = 0;
  while (i < templateValue.length - 4) {
    const id = templateValue.slice(i, i + 2);
    const lenStr = templateValue.slice(i + 2, i + 4);
    const len = parseInt(lenStr, 10);
    if (isNaN(len) || len < 0 || i + 4 + len > templateValue.length) break;
    const value = templateValue.slice(i + 4, i + 4 + len);
    if (id === "00") return value;
    i += 4 + len;
  }
  return null;
}

function crc16CcittFalse(data: string): number {
  let crc = 0xffff;
  const poly = 0x1021;
  for (let i = 0; i < data.length; i++) {
    crc ^= data.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      crc = (crc & 0x8000) ? (crc << 1) ^ poly : crc << 1;
      crc &= 0xffff;
    }
  }
  return crc;
}

function validateEmvCoCrc(payload: string): boolean {
  const crcIndex = payload.lastIndexOf("6304");
  if (crcIndex === -1 || crcIndex + 8 > payload.length) return false;
  const dataForCrc = payload.slice(0, crcIndex + 4);
  const storedCrc = payload.slice(crcIndex + 4, crcIndex + 8);
  const computed = crc16CcittFalse(dataForCrc).toString(16).toUpperCase().padStart(4, "0");
  return computed === storedCrc;
}

function isDuitNowQr(payload: string): { valid: boolean; reason?: string } {
  if (typeof payload !== "string" || !payload) {
    return { valid: false, reason: "Format DuitNow QR tidak sah. Kod QR mungkin rosak atau bukan DuitNow QR pembayaran." };
  }
  if (payload.length > MAX_PAYLOAD_LENGTH) {
    return { valid: false, reason: "Format DuitNow QR tidak sah. Kod QR mungkin rosak atau bukan DuitNow QR pembayaran." };
  }
  if (!EMVCO_ASCII.test(payload)) {
    return { valid: false, reason: "Format DuitNow QR tidak sah. Kod QR mungkin rosak atau bukan DuitNow QR pembayaran." };
  }
  const tlv = parseEmvCoTlv(payload);
  const formatIndicator = tlv.get("00");
  if (formatIndicator !== "02") {
    return {
      valid: false,
      reason: "Kod QR ini bukan DuitNow QR pembayaran. Hanya kod DuitNow QR Malaysia disokong.",
    };
  }
  const countryCode = tlv.get("58");
  if (countryCode !== "MY") {
    return {
      valid: false,
      reason: "Kod QR ini bukan DuitNow QR pembayaran. Hanya kod DuitNow QR Malaysia disokong.",
    };
  }
  const merchantAccount = tlv.get("26");
  if (!merchantAccount) {
    return {
      valid: false,
      reason: "Format DuitNow QR tidak sah. Kod QR mungkin rosak atau bukan DuitNow QR pembayaran.",
    };
  }
  const aid = getMerchantAccountAid(merchantAccount);
  if (aid !== DUITNOW_MALAYSIA_AID) {
    return {
      valid: false,
      reason: "Kod QR ini bukan DuitNow QR pembayaran. Hanya kod DuitNow QR Malaysia disokong.",
    };
  }
  if (!validateEmvCoCrc(payload)) {
    return {
      valid: false,
      reason: "Kod DuitNow QR tidak sah atau rosak.",
    };
  }
  return { valid: true };
}

function parseEmvCoMerchantName(payload: string): string | null {
  const tlv = parseEmvCoTlv(payload);
  const value = tlv.get("59");
  return value?.trim() || null;
}

/** Tag 54 = Transaction amount. Format: "10.00" or "458" + amount for MYR. */
function parseEmvCoAmount(payload: string): string | null {
  const tlv = parseEmvCoTlv(payload);
  const value = tlv.get("54")?.trim();
  if (!value) return null;
  // If starts with 3-digit currency code (e.g. 458 for MYR), use the rest
  const amountStr =
    /^\d{3}[\d.]+$/.test(value) && value.length > 4
      ? value.slice(3)
      : value;
  const num = parseFloat(amountStr);
  if (isNaN(num) || num < 0) return null;
  return `RM ${num.toFixed(2)}`;
}

function formatShortFilename(merchantName: string | null): string {
  const now = new Date();
  const date = now.toISOString().slice(2, 10).replace(/-/g, "");
  const time = now.toTimeString().slice(0, 5).replace(":", "");
  const base =
    merchantName
      ? merchantName.replace(/[^a-zA-Z0-9\s]/g, "").slice(0, 20).trim() || "qr"
      : "qr";
  return `${base}_${date}_${time}.png`;
}

function getPrimaryColor(): string {
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

const WATERMARK_TEXT = "tukarqr.my";

function renderSvgToPng(
  svgElement: SVGSVGElement,
  options?: {
    merchantName?: string | null;
    includeText?: boolean;
    ratio?: "1:1" | "3:4";
    watermark?: boolean;
  }
): Promise<string> {
  const merchantName = options?.merchantName ?? null;
  const includeText = options?.includeText ?? false;
  const ratio = options?.ratio ?? "1:1";
  const watermark = options?.watermark ?? true;

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
      const holderNameArea = includeText && merchantName ? 80 : 0;

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

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, totalWidth, totalHeight);

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

      if (includeText && merchantName) {
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#000000";
        ctx.font = HOLDER_NAME_FONT;
        ctx.fillText(
          merchantName,
          frameX + borderLeft + innerWidth / 2,
          qrY + qrSize + holderNameArea / 2
        );
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
        ctx.fillText(
          WATERMARK_TEXT,
          totalWidth - 12,
          totalHeight - 8
        );
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

function downloadQrAsPng(
  svgElement: SVGSVGElement,
  filename: string,
  merchantName?: string | null,
  ratio?: "1:1" | "3:4"
) {
  renderSvgToPng(svgElement, {
    merchantName,
    includeText: true,
    ratio: ratio ?? "1:1",
  }).then((dataUrl) => {
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  });
}

export default function Home() {
  const [activeTab, setActiveTab] = useState("upload");
  const [qrPayload, setQrPayload] = useState<string | null>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [isDecoding, setIsDecoding] = useState(false);
  const [qrFgColor, setQrFgColor] = useState("#000000");
  const [pngPreviewUrl, setPngPreviewUrl] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerAction, setDrawerAction] = useState<
    "download" | "copy" | null
  >(null);
  const [alertDismissed, setAlertDismissed] = useState(false);
  const [howToStartOpen, setHowToStartOpen] = useState(false);
  const [privacyPolicyOpen, setPrivacyPolicyOpen] = useState(false);

  const isDesktop = useMediaQuery("(min-width: 768px)");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem("qrkita-alert-dismissed");
    if (stored === "true") setAlertDismissed(true);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const completed = localStorage.getItem("qrkita-onboarding-completed");
    if (completed !== "true") setHowToStartOpen(true);
  }, []);

  function dismissAlert() {
    setAlertDismissed(true);
    if (typeof window !== "undefined") {
      localStorage.setItem("qrkita-alert-dismissed", "true");
    }
  }

  function handleHowToStartNext() {
    setHowToStartOpen(false);
    setPrivacyPolicyOpen(true);
  }

  function handlePrivacyPolicyDone() {
    setPrivacyPolicyOpen(false);
    if (typeof window !== "undefined") {
      localStorage.setItem("qrkita-onboarding-completed", "true");
    }
  }

  const merchantName = useMemo(
    () => (qrPayload ? parseEmvCoMerchantName(qrPayload) : null),
    [qrPayload]
  );

  const merchantAmount = useMemo(
    () => (qrPayload ? parseEmvCoAmount(qrPayload) : null),
    [qrPayload]
  );

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const qrSvgRef = useRef<SVGSVGElement>(null);
  const resultCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQrFgColor(getPrimaryColor());
  }, []);

  useEffect(() => {
    if (!qrPayload || !qrSvgRef.current) {
      setPngPreviewUrl(null);
      return;
    }
    const svg = qrSvgRef.current;
    const timer = requestAnimationFrame(() => {
      renderSvgToPng(svg, {
        merchantName,
        includeText: true,
        ratio: "1:1",
      })
        .then(setPngPreviewUrl)
        .catch(() => setPngPreviewUrl(null));
    });
    return () => {
      cancelAnimationFrame(timer);
      setPngPreviewUrl(null);
    };
  }, [qrPayload, merchantName]);

  useEffect(() => {
    if (qrPayload && resultCardRef.current) {
      const id = setTimeout(() => {
        resultCardRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
      return () => clearTimeout(id);
    }
  }, [qrPayload]);

  async function handleImageFile(
    file: File,
    options?: { fromCamera?: boolean }
  ) {
    const fromCamera = options?.fromCamera ?? false;

    const isImage =
      /^image\//.test(file.type) ||
      /\.(jpg|jpeg|png|gif|webp|bmp|heic|heif|tiff|tif|svg|ico|avif)(\?.*)?$/i.test(file.name);
    if (!isImage) {
      toast.error("Ralat", { description: "Sila pilih fail imej" });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Ralat", { description: "Imej terlalu besar. Maksimum 10MB." });
      return;
    }

    setIsDecoding(true);
    setQrPayload(null);

    const imageUrl = URL.createObjectURL(file);
    setOriginalImage(imageUrl);

    const img = new Image();
    img.onload = async () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(img, 0, 0);

      let payload: string | null = null;
      if (fromCamera) {
        payload = await preprocessAndDecode(canvas, { full: false });
        if (!payload) {
          payload = await preprocessAndDecode(canvas, { full: true });
        }
      } else {
        payload = await preprocessAndDecode(canvas, { full: true });
      }

      if (payload) {
        const validation = isDuitNowQr(payload);
        if (validation.valid) {
          setQrPayload(payload);
          toast.success("Berjaya", {
            description: "DuitNow QR berjaya dekod! QR pembayaran sudah sedia.",
          });
        } else {
          toast.error("Ralat", { description: validation.reason });
        }
      } else {
        toast.error("Ralat", { description: "Cuba lagi atau muat naik imej" });
      }

      setIsDecoding(false);
    };

    img.onerror = () => {
      toast.error("Ralat", { description: "Gagal memuatkan imej" });
      setIsDecoding(false);
    };

    img.src = imageUrl;
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleImageFile(file);
  }

  function handleCameraChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleImageFile(file, { fromCamera: true });
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleImageFile(file);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
  }

  function openDrawerForDownload() {
    setDrawerAction("download");
    setDrawerOpen(true);
  }

  function openDrawerForCopy() {
    setDrawerAction("copy");
    setDrawerOpen(true);
  }

  async function executeWithRatio(ratio: "1:1" | "3:4") {
    const svg = qrSvgRef.current;
    if (!svg || !qrPayload || !drawerAction) return;

    setDrawerOpen(false);

    if (drawerAction === "download") {
      downloadQrAsPng(
        svg,
        formatShortFilename(merchantName),
        merchantName,
        ratio
      );
      toast.success("Berjaya", {
        description:
          "DuitNow QR berjaya dimuat turun! Imbas dengan aplikasi bank anda.",
      });
    } else if (drawerAction === "copy") {
      if (!navigator.clipboard?.write) {
        toast.error("Ralat", {
          description: "Salin imej tidak disokong. Cuba muat turun imej.",
        });
        setDrawerAction(null);
        return;
      }
      const blobPromise = (async () => {
        const dataUrl = await renderSvgToPng(svg, {
          merchantName,
          includeText: true,
          ratio,
        });
        const arr = dataUrl.split(",");
        const mime = arr[0].match(/:(.*?);/)?.[1] ?? "image/png";
        const bstr = atob(arr[1] ?? "");
        const u8arr = new Uint8Array(bstr.length);
        for (let i = 0; i < bstr.length; i++) {
          u8arr[i] = bstr.charCodeAt(i);
        }
        return new Blob([u8arr], { type: mime });
      })();
      navigator.clipboard
        .write([new ClipboardItem({ "image/png": blobPromise })])
        .then(() =>
          toast.success("Berjaya", {
            description: "Imej QR berjaya disalin ke papan keratan",
          })
        )
        .catch(() =>
          toast.error("Ralat", {
            description: "Gagal menyalin imej. Cuba muat turun imej.",
          })
        )
        .finally(() => setDrawerAction(null));
      return;
    }

    setDrawerAction(null);
  }

  function handleReset() {
    setQrPayload(null);
    setOriginalImage(null);
    setIsDecoding(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
  }

  return (
    <main className="min-h-screen bg-background px-4 py-8 sm:py-12">
      <div className="mx-auto max-w-[800px] w-full space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2">
            <QrCode className="size-8 text-primary" />
            <h1 className="text-[22px] md:text-[26px] font-semibold leading-[1.25] tracking-[-0.015em] text-foreground">
              Tukar QR
            </h1>
          </div>
          <p className="text-[14px] md:text-[16px] leading-[1.6] text-muted-foreground text-balance">
            Tukar DuitNow QR yang kabur jadi QR code yang jelas dan bersih
          </p>
        </div>

        {/* Input Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-[16px] md:text-[18px]">
              Imbas DuitNow QR
            </CardTitle>
            <CardDescription className="text-[13px] md:text-[14px] leading-[1.55]">
              Muat naik foto atau guna kamera untuk merakam DuitNow QR untuk pembayaran
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              value={activeTab}
              onValueChange={(val) => {
                setActiveTab(val);
                handleReset();
              }}
            >
              <TabsList>
                <TabsTrigger value="upload">
                  Muat naik
                </TabsTrigger>
                <TabsTrigger value="camera">
                  Kamera
                </TabsTrigger>
              </TabsList>

              <TabsContent value="upload" className="mt-4">
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onClick={() => fileInputRef.current?.click()}
                  className="group relative flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-border bg-muted/30 p-8 transition-colors hover:border-primary/50 hover:bg-muted/50 min-h-[220px]"
                >
                  {originalImage ? (
                    <div className="relative select-none">
                      <img
                        src={originalImage}
                        alt="QR dimuat naik"
                        className="max-h-48 max-w-full rounded-md object-contain pointer-events-none"
                        loading="lazy"
                        draggable={false}
                        onDragStart={(e) => e.preventDefault()}
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReset();
                        }}
                        aria-label="Buang imej"
                        className="absolute -right-2 -top-2 rounded-full bg-primary p-1 text-primary-foreground shadow-sm hover:bg-primary/90"
                      >
                        <X className="size-3" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="rounded-full bg-primary/10 p-3">
                        <ImageIcon className="size-6 text-primary" />
                      </div>
                      <p className="text-[12px] md:text-[13px] font-medium tracking-[0.01em] text-foreground text-center">
                        Letakkan imej DuitNow QR di sini
                      </p>
                      <p className="text-[12px] leading-[1.45] tracking-[0.02em] text-muted-foreground text-center">
                        atau klik untuk melayari
                      </p>
                    </>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,.heic,.heif,.avif"
                    aria-label="Muat naik imej QR"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>
              </TabsContent>

              <TabsContent value="camera" className="mt-4">
                <div
                  onClick={() => cameraInputRef.current?.click()}
                  className="group relative flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-border bg-muted/30 p-8 transition-colors hover:border-primary/50 hover:bg-muted/50 min-h-[220px]"
                >
                  <div className="rounded-full bg-primary/10 p-3">
                    <Scan className="size-6 text-primary" />
                  </div>
                  <p className="text-[12px] md:text-[13px] font-medium tracking-[0.01em] text-foreground text-center">
                      Buka kamera dan imbas DuitNow QR
                    </p>
                    <p className="text-[12px] leading-[1.45] tracking-[0.02em] text-muted-foreground text-center">
                    Gambar akan digunakan untuk dekod QR
                  </p>
                  <input
                    ref={cameraInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    aria-label="Ambil gambar QR"
                    className="hidden"
                    onChange={handleCameraChange}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Loading */}
        {isDecoding && (
          <Card>
            <CardContent className="flex items-center justify-center gap-3 py-8">
              <RefreshCw className="size-5 animate-spin text-primary" />
              <span className="text-[14px] md:text-[16px] font-medium text-muted-foreground">
                Mendekod kod QR...
              </span>
            </CardContent>
          </Card>
        )}

        {/* Result Card */}
        {qrPayload && (
          <div
            ref={resultCardRef}
            className="animate-in fade-in slide-in-from-bottom-4 duration-300"
          >
          <Card>
            <CardHeader>
              <CardTitle className="text-[16px] md:text-[18px]">
                DuitNow QR Sedia Digunakan
              </CardTitle>
              <CardDescription className="text-[13px] md:text-[14px] leading-[1.55]">
                Imbas dengan aplikasi bank anda untuk bayar. Kandungan sama seperti asal.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* User education: verify before pay + disclaimer */}
              {!alertDismissed && (
                <div
                  role="alert"
                  className="relative rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2.5 pr-9 text-[13px] text-amber-700 dark:text-amber-400 dark:border-amber-500/30 dark:bg-amber-500/10"
                >
                  <button
                    type="button"
                    onClick={dismissAlert}
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
                    Alat ini hanya untuk kegunaan menukar DuitNow QR yang kabur atau gambar QR, kepada gambar yang jelas. Jangan gunakan untuk penipuan atau aktiviti haram. Pengguna bertanggungjawab sepenuhnya atas penggunaan alat ini.
                  </p>
                </div>
              )}

              <div className="flex flex-col items-center gap-2">
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
                {merchantName && (
                  <p className="text-[18px] md:text-[20px] font-semibold text-foreground text-center">
                    {merchantName}
                  </p>
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
                <Button
                  onClick={openDrawerForDownload}
                  className="w-full"
                >
                  Muat Turun
                </Button>
                <Button
                  onClick={openDrawerForCopy}
                  variant="outline"
                  className="w-full"
                >
                  Salin Imej
                </Button>
              </div>
            </CardContent>
          </Card>
          </div>
        )}

        {/* Hidden canvas for QR decoding */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Ratio selection - Dialog on desktop, Drawer on mobile */}
        {isDesktop ? (
          <Dialog open={drawerOpen} onOpenChange={setDrawerOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Pilih nisbah</DialogTitle>
                <DialogDescription>
                  Pilih saiz imej untuk muat turun atau salin
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => executeWithRatio("1:1")}
                >
                  1:1 (1000 x 1000 px)
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => executeWithRatio("3:4")}
                >
                  3:4 (900 x 1200 px)
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        ) : (
          <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
            <DrawerContent>
              <div className="mx-auto w-full max-w-sm">
                <DrawerHeader>
                  <DrawerTitle>Pilih nisbah</DrawerTitle>
                  <DrawerDescription>
                    Pilih saiz imej untuk muat turun atau salin
                  </DrawerDescription>
                </DrawerHeader>
                <div className="flex flex-col gap-2 p-4">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => executeWithRatio("1:1")}
                  >
                    1:1 (1000 x 1000 px)
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => executeWithRatio("3:4")}
                  >
                    3:4 (900 x 1200 px)
                  </Button>
                </div>
              </div>
            </DrawerContent>
          </Drawer>
        )}

        {/* Onboarding: How to Start */}
        <ResponsiveModal
          open={howToStartOpen}
          onOpenChange={setHowToStartOpen}
          title="Cara guna"
          description="Ikuti langkah mudah untuk menukar DuitNow QR anda"
        >
          <HowToStart onNext={handleHowToStartNext} />
        </ResponsiveModal>

        {/* Onboarding: Privacy Policy */}
        <ResponsiveModal
          open={privacyPolicyOpen}
          onOpenChange={setPrivacyPolicyOpen}
          title="Dasar privasi"
          description="Maklumat tentang privasi dan pemprosesan data"
        >
          <PrivacyPolicy onDone={handlePrivacyPolicyDone} />
        </ResponsiveModal>

        {/* Footer */}
        {!qrPayload && (
          <div className="text-center">
            <p className="text-[12px] leading-[1.45] tracking-[0.02em] text-muted-foreground text-balance">
              Tukar QR &mdash; Penjana semula DuitNow QR pembayaran. Diproses sepenuhnya dalam pelayar anda. Tiada data dihantar ke pelayan.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
