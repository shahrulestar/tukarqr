"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import jsQR from "jsqr";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "sonner";
import {
  RefreshCw,
  QrCode,
  ImageIcon,
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
    return { valid: false, reason: "Format QR DuitNow tidak sah. Kod QR mungkin rosak atau bukan QR pembayaran." };
  }
  if (payload.length > MAX_PAYLOAD_LENGTH) {
    return { valid: false, reason: "Format QR DuitNow tidak sah. Kod QR mungkin rosak atau bukan QR pembayaran." };
  }
  if (!EMVCO_ASCII.test(payload)) {
    return { valid: false, reason: "Format QR DuitNow tidak sah. Kod QR mungkin rosak atau bukan QR pembayaran." };
  }
  const tlv = parseEmvCoTlv(payload);
  const formatIndicator = tlv.get("00");
  if (formatIndicator !== "02") {
    return {
      valid: false,
      reason: "Kod QR ini bukan QR pembayaran DuitNow. Hanya kod QR DuitNow Malaysia disokong.",
    };
  }
  const countryCode = tlv.get("58");
  if (countryCode !== "MY") {
    return {
      valid: false,
      reason: "Kod QR ini bukan QR pembayaran DuitNow. Hanya kod QR DuitNow Malaysia disokong.",
    };
  }
  const merchantAccount = tlv.get("26");
  if (!merchantAccount) {
    return {
      valid: false,
      reason: "Format QR DuitNow tidak sah. Kod QR mungkin rosak atau bukan QR pembayaran.",
    };
  }
  const aid = getMerchantAccountAid(merchantAccount);
  if (aid !== DUITNOW_MALAYSIA_AID) {
    return {
      valid: false,
      reason: "Kod QR ini bukan QR pembayaran DuitNow. Hanya kod QR DuitNow Malaysia disokong.",
    };
  }
  if (!validateEmvCoCrc(payload)) {
    return {
      valid: false,
      reason: "Kod QR DuitNow tidak sah atau rosak.",
    };
  }
  return { valid: true };
}

function parseEmvCoMerchantName(payload: string): string | null {
  const tlv = parseEmvCoTlv(payload);
  const value = tlv.get("59");
  return value?.trim() || null;
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

function renderSvgToPng(
  svgElement: SVGSVGElement,
  merchantName?: string | null,
  scale = 4
): Promise<string> {
  return new Promise((resolve, reject) => {
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgData], {
      type: "image/svg+xml;charset=utf-8",
    });
    const url = URL.createObjectURL(svgBlob);
    const img = new Image();
    img.onload = () => {
      const qrSize = img.width * scale;
      const padding = 24 * scale;
      const nameHeight = merchantName ? 32 * scale : 0;
      const canvas = document.createElement("canvas");
      canvas.width = qrSize + padding * 2;
      canvas.height = qrSize + padding * 2 + nameHeight;
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, padding, padding, qrSize, qrSize);

      if (merchantName) {
        ctx.fillStyle = "#000000";
        ctx.font = `600 ${18 * scale}px system-ui, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        const displayName = merchantName.length > 30 ? merchantName.slice(0, 27) + "..." : merchantName;
        ctx.fillText(displayName, canvas.width / 2, qrSize + padding + nameHeight / 2);
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
  merchantName?: string | null
) {
  renderSvgToPng(svgElement, merchantName).then((dataUrl) => {
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

  const merchantName = useMemo(
    () => (qrPayload ? parseEmvCoMerchantName(qrPayload) : null),
    [qrPayload]
  );

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const qrSvgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    setQrFgColor(getPrimaryColor());
  }, []);

  useEffect(() => {
    if (!qrPayload || !qrSvgRef.current) {
      setPngPreviewUrl(null);
      return;
    }
    const svg = qrSvgRef.current;
    const name = merchantName ?? null;
    const timer = requestAnimationFrame(() => {
      renderSvgToPng(svg, name, 2)
        .then(setPngPreviewUrl)
        .catch(() => setPngPreviewUrl(null));
    });
    return () => {
      cancelAnimationFrame(timer);
      setPngPreviewUrl(null);
    };
  }, [qrPayload, merchantName]);

  async function handleImageFile(
    file: File,
    options?: { fromCamera?: boolean }
  ) {
    const fromCamera = options?.fromCamera ?? false;

    const isImage =
      /^image\//.test(file.type) ||
      /\.(jpg|jpeg|png|gif|webp|bmp|heic|heif|tiff|tif|svg|ico|avif)(\?.*)?$/i.test(file.name);
    if (!isImage) {
      toast.error("Sila pilih fail imej");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Imej terlalu besar. Maksimum 10MB.");
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
          toast.success("QR DuitNow berjaya dekod! QR pembayaran sudah sedia.");
        } else {
          toast.error(validation.reason);
        }
      } else {
        toast.error("Cuba lagi atau muat naik imej");
      }

      setIsDecoding(false);
    };

    img.onerror = () => {
      toast.error("Gagal memuatkan imej");
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

  function handleDownload() {
    const svg = qrSvgRef.current;
    if (!svg || !qrPayload) return;
    downloadQrAsPng(svg, formatShortFilename(merchantName), merchantName);
    toast.success("QR DuitNow berjaya dimuat turun! Imbas dengan aplikasi bank anda.");
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
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              QRKita
            </h1>
          </div>
          <p className="text-sm text-muted-foreground font-normal">
            Tukar QR DuitNow yang kabur jadi QR code yang jelas dan bersih
          </p>
        </div>

        {/* Input Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Imbas QR DuitNow
            </CardTitle>
            <CardDescription className="font-normal">
              Muat naik foto atau guna kamera untuk merakam QR DuitNow untuk pembayaran
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
              <TabsList className="w-full">
                <TabsTrigger value="upload" className="flex-1 font-medium">
                  Muat naik
                </TabsTrigger>
                <TabsTrigger value="camera" className="flex-1 font-medium">
                  Kamera
                </TabsTrigger>
              </TabsList>

              <TabsContent value="upload" className="mt-4">
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onClick={() => fileInputRef.current?.click()}
                  className="group relative flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-border bg-muted/30 p-8 transition-colors hover:border-primary/50 hover:bg-muted/50"
                >
                  {originalImage ? (
                    <div className="relative">
                      <img
                        src={originalImage}
                        alt="QR dimuat naik"
                        className="max-h-48 max-w-full rounded-md object-contain"
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
                      <div className="text-center">
                        <p className="text-sm font-medium text-foreground">
                          Letakkan imej QR DuitNow di sini
                        </p>
                        <p className="text-xs text-muted-foreground font-normal mt-1">
                          atau klik untuk melayari
                        </p>
                      </div>
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
                <div className="space-y-3">
                  <div
                    onClick={() => cameraInputRef.current?.click()}
                    className="group relative flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-border bg-muted/30 p-8 transition-colors hover:border-primary/50 hover:bg-muted/50"
                  >
                    <div className="rounded-full bg-primary/10 p-3">
                      <ImageIcon className="size-6 text-primary" />
                    </div>
                    <p className="text-sm font-medium text-foreground text-center">
                      Klik untuk buka kamera dan ambil gambar QR DuitNow
                    </p>
                    <p className="text-xs text-muted-foreground font-normal">
                      Gambar akan digunakan untuk dekod QR
                    </p>
                  </div>
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
              <span className="text-sm font-medium text-muted-foreground">
                Mendekod kod QR...
              </span>
            </CardContent>
          </Card>
        )}

        {/* Result Card */}
        {qrPayload && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                QR DuitNow Pembayaran Sedia
              </CardTitle>
              <CardDescription className="font-normal">
                Imbas dengan aplikasi bank anda untuk bayar. Kandungan sama seperti asal.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center gap-2">
                <div className="rounded-lg bg-white p-6">
                  <div className="relative inline-block">
                    <QRCodeSVG
                      ref={qrSvgRef}
                      value={qrPayload}
                      size={200}
                      level="M"
                      marginSize={2}
                      fgColor={qrFgColor}
                      bgColor="#ffffff"
                      title="QR DuitNow - Imbas untuk bayar"
                      className={pngPreviewUrl ? "sr-only" : undefined}
                      aria-hidden={!!pngPreviewUrl}
                    />
                    {pngPreviewUrl && (
                      <img
                        src={pngPreviewUrl}
                        alt="QR DuitNow - Imbas untuk bayar"
                        className="w-[200px] h-auto object-contain"
                        draggable={false}
                      />
                    )}
                  </div>
                </div>
                <span className="text-xs font-normal text-muted-foreground">
                  Serasi dengan DuitNow, FPX, dan semua aplikasi bank Malaysia
                </span>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleDownload}
                  className="flex-1 font-medium"
                >
                  Muat Turun
                </Button>
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="font-medium"
                >
                  Set Semula
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Hidden canvas for QR decoding */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground font-normal">
          QRKita &mdash; Penjana semula QR pembayaran DuitNow
        </p>
      </div>
    </main>
  );
}
