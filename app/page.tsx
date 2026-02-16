"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { RefreshCw, QrCode, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
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
import { QrUploadZone } from "@/components/qr-upload-zone";
import { QrResultCard } from "@/components/qr-result-card";
import {
  MAX_FILE_SIZE_BYTES,
  MAX_IMAGE_DIMENSION,
  MAX_IMAGE_DIMENSION_HARD,
  SUPPORTED_MIME_TYPES,
  SUPPORTED_EXTENSIONS,
  isHeicFile,
  convertHeicToJpeg,
} from "@/lib/image-validation";
import { preprocessAndDecode } from "@/lib/qr-decode";
import {
  isDuitNowQr,
  parseEmvCoMerchantName,
  parseEmvCoBankName,
  parseEmvCoAmount,
} from "@/lib/emvco";
import {
  formatShortFilename,
  getPrimaryColor,
  renderSvgToPng,
  downloadQrAsPng,
} from "@/lib/qr-render";

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

  const bankName = useMemo(
    () => (qrPayload ? parseEmvCoBankName(qrPayload) : null),
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
  const decodeAbortRef = useRef<AbortController | null>(null);

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
        bankName,
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
  }, [qrPayload, merchantName, bankName]);

  useEffect(() => {
    if (qrPayload && resultCardRef.current) {
      const id = setTimeout(() => {
        resultCardRef.current?.focus();
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

    const isFormatValid =
      (file.type && SUPPORTED_MIME_TYPES.includes(file.type)) ||
      SUPPORTED_EXTENSIONS.test(file.name);
    if (!isFormatValid) {
      toast.error("Ralat", {
        description:
          "Format imej tidak disokong. Sila gunakan JPG, PNG, WebP, HEIC, atau BMP.",
      });
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      toast.error("Ralat", {
        description:
          "Imej terlalu besar. Maksimum 30MB. Sila pilih imej yang lebih kecil.",
      });
      return;
    }

    if (originalImage?.startsWith?.("blob:")) {
      URL.revokeObjectURL(originalImage);
    }
    decodeAbortRef.current?.abort();
    decodeAbortRef.current = new AbortController();
    const signal = decodeAbortRef.current.signal;
    setIsDecoding(true);
    setQrPayload(null);

    let blobToUse: Blob = file;
    if (isHeicFile(file)) {
      try {
        blobToUse = await convertHeicToJpeg(file);
      } catch {
        setIsDecoding(false);
        toast.error("Ralat", {
          description:
            "Gagal menukar imej HEIC. Sila cuba imej lain atau tukar ke format JPG pada iPhone.",
        });
        return;
      }
    }

    const imageUrl = URL.createObjectURL(blobToUse);
    setOriginalImage(imageUrl);

    const img = new Image();
    img.onload = async () => {
      try {
        const canvas = canvasRef.current;
        if (!canvas) return;

        let w = img.width;
        let h = img.height;

        if (w > MAX_IMAGE_DIMENSION_HARD || h > MAX_IMAGE_DIMENSION_HARD) {
          toast.error("Ralat", {
            description:
              "Imej terlalu besar untuk diproses. Sila gunakan resolusi yang lebih kecil (maksimum 4096px).",
          });
          return;
        }

        if (w > MAX_IMAGE_DIMENSION || h > MAX_IMAGE_DIMENSION) {
          const ratio = Math.min(
            MAX_IMAGE_DIMENSION / w,
            MAX_IMAGE_DIMENSION / h
          );
          w = Math.round(w * ratio);
          h = Math.round(h * ratio);
        }

        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.drawImage(img, 0, 0, w, h);

        let payload: string | null = null;
        if (fromCamera) {
          payload = await preprocessAndDecode(canvas, {
            full: false,
            signal,
          });
          if (!payload) {
            payload = await preprocessAndDecode(canvas, { full: true, signal });
          }
        } else {
          payload = await preprocessAndDecode(canvas, { full: true, signal });
        }

        if (payload) {
          const validation = isDuitNowQr(payload);
          if (validation.valid) {
            setQrPayload(payload);
            toast.success("Berjaya", {
              description:
                "DuitNow QR berjaya dekod! QR pembayaran sudah sedia.",
            });
          } else {
            toast.error("Ralat", { description: validation.reason });
          }
        } else if (!signal.aborted) {
          toast.error("Ralat", {
            description:
              "Imej tidak jelas atau berkilat. Sila ambil semula atau muat naik imej yang lebih jelas.",
          });
        }
      } catch {
        if (!signal.aborted) {
          toast.error("Ralat", {
            description:
              "Imej tidak jelas atau berkilat. Sila ambil semula atau muat naik imej yang lebih jelas.",
          });
        }
      } finally {
        setIsDecoding(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
        if (cameraInputRef.current) cameraInputRef.current.value = "";
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(imageUrl);
      toast.error("Ralat", {
        description:
          "Gagal memuatkan imej. Format mungkin tidak disokong oleh pelayar. Cuba JPG, PNG atau HEIC.",
      });
      setIsDecoding(false);
    };

    img.src = imageUrl;
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleImageFile(file);
    else toast.error("Ralat", { description: "Sila seret fail imej sahaja." });
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
  }

  function handleReset() {
    if (originalImage?.startsWith?.("blob:")) {
      URL.revokeObjectURL(originalImage);
    }
    setQrPayload(null);
    setOriginalImage(null);
    setIsDecoding(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
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
        bankName,
        ratio,
        () => setDrawerAction(null)
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
          bankName,
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

  return (
    <main className="min-h-screen bg-background px-4 py-8 sm:py-12">
      <div className="mx-auto max-w-[800px] w-full space-y-6">
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

        <QrUploadZone
          fileInputRef={fileInputRef}
          cameraInputRef={cameraInputRef}
          activeTab={activeTab}
          onTabChange={(val) => {
            setActiveTab(val);
            handleReset();
          }}
          onFileSelect={handleImageFile}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          originalImage={originalImage}
          onReset={handleReset}
        />

        {isDecoding && (
          <Card
            aria-live="polite"
            aria-busy={true}
          >
            <CardContent className="flex items-center justify-center gap-3 py-8">
              <RefreshCw className="size-5 animate-spin text-primary" />
              <span className="text-[14px] md:text-[16px] font-medium text-muted-foreground">
                Mendekod kod QR...
              </span>
            </CardContent>
          </Card>
        )}

        {qrPayload && (
          <QrResultCard
            resultCardRef={resultCardRef}
            qrSvgRef={qrSvgRef}
            qrPayload={qrPayload}
            pngPreviewUrl={pngPreviewUrl}
            qrFgColor={qrFgColor}
            merchantName={merchantName}
            bankName={bankName}
            merchantAmount={merchantAmount}
            alertDismissed={alertDismissed}
            onDismissAlert={dismissAlert}
            onDownload={openDrawerForDownload}
            onCopy={openDrawerForCopy}
          />
        )}

        <canvas ref={canvasRef} className="hidden" />

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

        <ResponsiveModal
          open={howToStartOpen}
          onOpenChange={setHowToStartOpen}
          title="Cara guna"
          description="Ikuti langkah mudah untuk menukar DuitNow QR anda"
        >
          <HowToStart onNext={handleHowToStartNext} />
        </ResponsiveModal>

        <ResponsiveModal
          open={privacyPolicyOpen}
          onOpenChange={setPrivacyPolicyOpen}
          title="Dasar privasi"
          description="Maklumat tentang privasi dan pemprosesan data"
        >
          <PrivacyPolicy onDone={handlePrivacyPolicyDone} />
        </ResponsiveModal>

        {!qrPayload && (
          <div className="text-center">
            <p className="text-[12px] leading-[1.45] tracking-[0.02em] text-muted-foreground text-balance">
              Tukar QR &mdash; Penjana semula DuitNow QR pembayaran. Diproses
              sepenuhnya dalam pelayar anda. Tiada data dihantar ke pelayan.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
