"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  startTransition,
} from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Square, Circle } from "lucide-react";

import { Button } from "@/components/ui/button";
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
import { Switch } from "@/components/ui/switch";
import { useMediaQuery } from "@/hooks/use-media-query";
import { ResponsiveModal } from "@/components/responsive-modal";
import { HowToStart } from "@/components/onboarding/how-to-start";
import { PrivacyPolicy } from "@/components/onboarding/privacy-policy";
import {
  QrUploadZone,
  type UploadItem,
} from "@/components/qr-upload-zone";
import { QrResultList } from "@/components/qr-result-card";
import { QrResultCardSingle } from "@/components/qr-result-card-single";
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
} from "@/lib/emvco";
import {
  getPrimaryColor,
  downloadQrAsPng,
  formatShortFilename,
} from "@/lib/qr-render";
import { copyQrImageToClipboard } from "@/lib/clipboard-utils";

const MAX_BATCH_SIZE = 10;
const CONCURRENCY_LIMIT_DESKTOP = 2;
const CONCURRENCY_LIMIT_MOBILE = 1;
const YIELD_BETWEEN_CHUNKS_MS = 16;

function createItem(file: File): UploadItem & { payload?: string } {
  return {
    id: `${file.name}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    file,
    status: "pending",
    progress: 0,
  };
}

function mapDecodeErrorToMessage(raw: string): string {
  if (raw.includes("memuatkan") || raw.includes("Format imej"))
    return "Format imej tidak disokong. Sila gunakan JPG, PNG atau HEIC.";
  if (raw.includes("bukan DuitNow") || raw.includes("Hanya kod DuitNow"))
    return "Ini bukan kod DuitNow QR yang sah.";
  if (
    raw.includes("tidak jelas") ||
    raw.includes("berkilat") ||
    raw.includes("kabur")
  )
    return "Imej QR tidak jelas atau kabur. Sila ambil gambar yang lebih jelas.";
  if (raw.includes("Ralat semasa"))
    return "Imej QR tidak jelas atau kabur. Sila ambil gambar yang lebih jelas.";
  if (
    raw.includes("Tiada") ||
    raw.includes("tidak sah") ||
    raw.includes("rosak")
  )
    return "Tiada QR DuitNow dikesan dalam imej ini.";
  return raw;
}

export function QrApp() {
  const pathname = usePathname();
  const router = useRouter();
  const isDownloadRoute = pathname === "/download";
  const isHomeRoute = pathname === "/";

  const [activeTab, setActiveTab] = useState("upload");
  const [results, setResults] = useState<
    (UploadItem & { payload?: string })[]
  >([]);
  const [qrFgColor, setQrFgColor] = useState("#000000");
  const [configOpen, setConfigOpen] = useState(false);
  const [alertDismissed, setAlertDismissed] = useState(false);
  const [howToStartOpen, setHowToStartOpen] = useState(false);
  const [privacyPolicyOpen, setPrivacyPolicyOpen] = useState(false);
  const [qrStyle, setQrStyle] = useState<"classic" | "rounded">("classic");
  const [showBankName, setShowBankName] = useState(true);
  const [outerBg, setOuterBg] = useState<"white" | "transparent">("white");
  const [drawerAction, setDrawerAction] = useState<
    "download" | "copy" | null
  >(null);
  const [exportRatio, setExportRatio] = useState<"1:1" | "3:4">("1:1");

  const isDesktop = useMediaQuery("(min-width: 768px)");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const decodeAbortRef = useRef<AbortController | null>(null);
  const resultCardRef = useRef<HTMLDivElement>(null);
  const singleQrSvgRef = useRef<SVGSVGElement | null>(null);
  const processingRef = useRef(false);
  useEffect(() => {
    setQrFgColor(getPrimaryColor());
  }, []);

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

  const prevResultsLengthRef = useRef(results.length);
  useEffect(() => {
    if (prevResultsLengthRef.current > 0 && results.length === 0) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    prevResultsLengthRef.current = results.length;
  }, [results.length]);

  function dismissAlert() {
    setAlertDismissed(true);
    if (typeof window !== "undefined") {
      localStorage.setItem("qrkita-alert-dismissed", "true");
    }
  }

  function handleConfigOpenChange(open: boolean) {
    setConfigOpen(open);
    if (!open) setDrawerAction(null);
  }

  function executeSingleExport(action: "download" | "copy") {
    const svg = singleQrSvgRef.current;
    if (!svg || !singleResult) return;
    const merchantName = parseEmvCoMerchantName(singleResult.payload);
    const bankName = showBankName
      ? parseEmvCoBankName(singleResult.payload)
      : null;
    if (action === "download") {
      downloadQrAsPng(
        svg,
        formatShortFilename(merchantName),
        merchantName,
        bankName,
        exportRatio,
        outerBg,
        () => {}
      );
      toast.success("Berjaya", {
        description: "Imej QR berjaya dimuat turun ke peranti anda.",
      });
      handleConfigOpenChange(false);
    } else {
      copyQrImageToClipboard(svg, {
        merchantName,
        bankName,
        includeText: true,
        ratio: exportRatio,
        watermark: false,
        outerBg,
      })
        .then(() => {
          toast.success("Berjaya", {
            description: "Imej QR berjaya disalin ke papan keratan.",
          });
        })
        .catch(() => {
          toast.error("Ralat", {
            description: "Gagal menyalin imej ke papan keratan. Sila gunakan Muat Turun sebagai alternatif.",
          });
        })
        .finally(() => {
          handleConfigOpenChange(false);
        });
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

  const updateItem = useCallback(
    (id: string, updates: Partial<UploadItem & { payload?: string }>) => {
      setResults((prev) =>
        prev.map((r) => (r.id === id ? { ...r, ...updates } : r))
      );
    },
    []
  );

  const processSingleFile = useCallback(
    async (
      item: UploadItem & { payload?: string },
      fromCamera: boolean,
      signal: AbortSignal,
      canvasOverride?: HTMLCanvasElement | null,
      preloaded?: { img: HTMLImageElement; url: string },
      batchSize = 1
    ): Promise<boolean> => {
      const { id, file } = item;

      const isFormatValid =
        (file.type && SUPPORTED_MIME_TYPES.includes(file.type)) ||
        SUPPORTED_EXTENSIONS.test(file.name);
      if (!isFormatValid) {
        const err = mapDecodeErrorToMessage("Format imej tidak disokong.");
        updateItem(id, {
          status: "failed",
          progress: 100,
          error: err,
        });
        if (batchSize <= 1) toast.error("Ralat", { description: err });
        return false;
      }

      if (file.size > MAX_FILE_SIZE_BYTES) {
        const err = "Imej terlalu besar (maks 30MB).";
        updateItem(id, {
          status: "failed",
          progress: 100,
          error: err,
        });
        if (batchSize <= 1) toast.error("Ralat", { description: err });
        return false;
      }

      updateItem(id, { status: "decoding", progress: 0 });

      const runDecode = async (img: HTMLImageElement, cleanup: () => void) => {
        let progressInterval: ReturnType<typeof setInterval> | null = null;
        try {
          const canvas = canvasOverride ?? canvasRef.current;
          if (!canvas || signal.aborted) {
            cleanup();
            return false;
          }

          updateItem(id, { progress: 25 });

          let w = img.width;
          let h = img.height;

          if (w > MAX_IMAGE_DIMENSION_HARD || h > MAX_IMAGE_DIMENSION_HARD) {
            const err = "Imej terlalu besar (maks 4096px).";
            updateItem(id, {
              status: "failed",
              progress: 100,
              error: err,
            });
            if (batchSize <= 1) toast.error("Ralat", { description: err });
            cleanup();
            return false;
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
          if (!ctx) {
            cleanup();
            return false;
          }

          ctx.drawImage(img, 0, 0, w, h);
          updateItem(id, { progress: 45 });

          const progressIntervalMs = batchSize >= 5 ? 300 : 200;
          progressInterval = setInterval(() => {
            if (signal.aborted) return;
            startTransition(() => {
              setResults((prev) =>
                prev.map((r) => {
                  if (r.id !== id || r.status !== "decoding") return r;
                  const next = Math.min(90, r.progress + 10);
                  return { ...r, progress: next };
                })
              );
            });
          }, progressIntervalMs);

          let payload: string | null = null;
          if (fromCamera) {
            payload = await preprocessAndDecode(canvas, {
              full: false,
              signal,
            });
            if (!payload) {
              payload = await preprocessAndDecode(canvas, {
                full: true,
                signal,
              });
            }
          } else {
            payload = await preprocessAndDecode(canvas, {
              full: true,
              signal,
            });
          }

          if (progressInterval) clearInterval(progressInterval);
          cleanup();

          if (signal.aborted) return false;

          if (payload) {
            const validation = isDuitNowQr(payload);
            if (validation.valid) {
              updateItem(id, {
                status: "success",
                progress: 100,
                payload,
              });
              return true;
            }
            const err = mapDecodeErrorToMessage(validation.reason ?? "");
            updateItem(id, {
              status: "failed",
              progress: 100,
              error: err,
            });
            if (batchSize <= 1) toast.error("Ralat", { description: err });
            return false;
          }
          const err = mapDecodeErrorToMessage("Tiada QR dikesan.");
          updateItem(id, {
            status: "failed",
            progress: 100,
            error: err,
          });
          if (batchSize <= 1) toast.error("Ralat", { description: err });
          return false;
        } catch {
          if (progressInterval) clearInterval(progressInterval);
          if (!signal.aborted) {
            const err = mapDecodeErrorToMessage("Ralat semasa dekod.");
            updateItem(id, {
              status: "failed",
              progress: 100,
              error: err,
            });
            if (batchSize <= 1) toast.error("Ralat", { description: err });
          }
          return false;
        }
      };

      if (preloaded) {
        return runDecode(preloaded.img, () =>
          URL.revokeObjectURL(preloaded!.url)
        );
      }

      let blobToUse: Blob = file;
      if (isHeicFile(file)) {
        try {
          blobToUse = await convertHeicToJpeg(file);
        } catch {
          const err = mapDecodeErrorToMessage("Gagal menukar HEIC.");
          updateItem(id, {
            status: "failed",
            progress: 100,
            error: err,
          });
          if (batchSize <= 1) toast.error("Ralat", { description: err });
          return false;
        }
      }

      updateItem(id, { progress: 10 });
      const imageUrl = URL.createObjectURL(blobToUse);
      const img = new Image();

      const cleanup = () => {
        URL.revokeObjectURL(imageUrl);
      };

      return new Promise<boolean>((resolve) => {
        img.onerror = () => {
          cleanup();
          const err = mapDecodeErrorToMessage("Gagal memuatkan imej.");
          updateItem(id, {
            status: "failed",
            progress: 100,
            error: err,
          });
          if (batchSize <= 1) toast.error("Ralat", { description: err });
          resolve(false);
        };

        img.onload = async () => {
          const ok = await runDecode(img, cleanup);
          resolve(ok);
        };

        img.src = imageUrl;
      });
    },
    [updateItem]
  );

  const processQueue = useCallback(
    async (currentResults: (UploadItem & { payload?: string })[]) => {
      if (processingRef.current) return;

      const pending = currentResults.filter((r) => r.status === "pending");
      if (pending.length === 0) return;

      processingRef.current = true;
      decodeAbortRef.current?.abort();
      decodeAbortRef.current = new AbortController();
      const signal = decodeAbortRef.current.signal;

      const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
      const concurrency = isMobile
        ? CONCURRENCY_LIMIT_MOBILE
        : CONCURRENCY_LIMIT_DESKTOP;

      const canvasPool = Array.from(
        { length: Math.min(concurrency, pending.length) },
        () => document.createElement("canvas")
      );

      async function preloadChunk(
        items: (UploadItem & { payload?: string })[]
      ): Promise<{ img: HTMLImageElement; url: string }[] | null> {
        if (signal.aborted || !items.length) return null;
        const results: { img: HTMLImageElement; url: string }[] = [];
        for (const item of items) {
          if (signal.aborted) {
            results.forEach((r) => URL.revokeObjectURL(r.url));
            return null;
          }
          let blob: Blob = item.file;
          if (isHeicFile(item.file)) {
            try {
              blob = await convertHeicToJpeg(item.file);
            } catch {
              results.forEach((r) => URL.revokeObjectURL(r.url));
              return null;
            }
          }
          const url = URL.createObjectURL(blob);
          const img = new Image();
          try {
            await new Promise<void>((resolve, reject) => {
              img.onload = () => resolve();
              img.onerror = () => reject(new Error("Load failed"));
              img.src = url;
            });
            if (signal.aborted) {
              URL.revokeObjectURL(url);
              results.forEach((r) => URL.revokeObjectURL(r.url));
              return null;
            }
            results.push({ img, url });
          } catch {
            URL.revokeObjectURL(url);
            results.forEach((r) => URL.revokeObjectURL(r.url));
            return null;
          }
        }
        return results;
      }

      let successCount = 0;
      let nextPreload: Promise<{ img: HTMLImageElement; url: string }[] | null> =
        pending.length > concurrency
          ? preloadChunk(
              pending.slice(concurrency, 2 * concurrency)
            )
          : Promise.resolve(null);
      let preloadedForCurrent: { img: HTMLImageElement; url: string }[] | null =
        null;

      for (let i = 0; i < pending.length; i += concurrency) {
        if (signal.aborted) break;
        const chunk = pending.slice(i, i + concurrency);
        const preloaded = await nextPreload;
        nextPreload =
          i + 2 * concurrency < pending.length
            ? preloadChunk(
                pending.slice(
                  i + 2 * concurrency,
                  i + 3 * concurrency
                )
              )
            : Promise.resolve(null);
        const toUse = preloadedForCurrent;
        preloadedForCurrent = preloaded;
        const outcomes = await Promise.all(
          chunk.map((item, j) =>
            processSingleFile(
              item,
              false,
              signal,
              canvasPool[j] ?? undefined,
              toUse?.[j],
              pending.length
            )
          )
        );
        if (toUse) {
          toUse.forEach((p) => URL.revokeObjectURL(p.url));
        }
        successCount += outcomes.filter(Boolean).length;
        await new Promise<void>((resolve) =>
          setTimeout(resolve, YIELD_BETWEEN_CHUNKS_MS)
        );
      }

      processingRef.current = false;
      if (successCount > 0) {
        toast.success("Berjaya", {
          description: `${successCount} imej DuitNow QR berjaya dikesan dan diproses.`,
        });
      }
    },
    [processSingleFile]
  );

  useEffect(() => {
    const hasPending = results.some((r) => r.status === "pending");
    if (hasPending && !processingRef.current) {
      processQueue(results);
    }
  }, [results, processQueue]);

  function handleFilesSelect(files: File[]) {
    if (!files.length) return;

    const validFiles = files.filter((f) => {
      const valid =
        (f.type && SUPPORTED_MIME_TYPES.includes(f.type)) ||
        SUPPORTED_EXTENSIONS.test(f.name);
      if (!valid) {
        toast.error("Ralat", {
          description: `Format fail tidak disokong. Sila gunakan JPG, PNG atau HEIC.`,
        });
        return false;
      }
      if (f.size > MAX_FILE_SIZE_BYTES) {
        toast.error("Ralat", {
          description: `Saiz fail melebihi had (maksimum 30MB).`,
        });
        return false;
      }
      return true;
    });

    if (!validFiles.length) return;

    const toAdd = validFiles
      .slice(0, MAX_BATCH_SIZE - results.length)
      .map(createItem);

    if (validFiles.length > MAX_BATCH_SIZE) {
      toast.error("Ralat", {
        description: `Had maksimum ${MAX_BATCH_SIZE} fail. Sebahagian fail tidak ditambah.`,
      });
    }

    setResults((prev) => [...prev, ...toAdd]);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
  }

  function handleReset() {
    decodeAbortRef.current?.abort();
    setResults([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
  }

  function handleRemoveItem(id: string) {
    const item = results.find((r) => r.id === id);
    if (item?.status === "decoding") {
      decodeAbortRef.current?.abort();
    }
    setResults((prev) => prev.filter((r) => r.id !== id));
  }

  const successfulResults = results.filter(
    (r): r is UploadItem & { payload: string } =>
      r.status === "success" && !!r.payload
  );
  const isProcessingComplete =
    results.length > 0 &&
    !results.some((r) => r.status === "pending" || r.status === "decoding");
  const isSingleMode = results.length === 1;
  const singleResult = successfulResults.length === 1 ? successfulResults[0] : null;

  const isDecoding = results.some(
    (r) => r.status === "pending" || r.status === "decoding"
  );

  useEffect(() => {
    if (
      isHomeRoute &&
      isProcessingComplete &&
      successfulResults.length > 0
    ) {
      router.push("/download");
    }
  }, [isHomeRoute, isProcessingComplete, successfulResults.length, router]);

  useEffect(() => {
    if (isDownloadRoute && results.length === 0) {
      router.replace("/");
    }
  }, [isDownloadRoute, results.length, router]);

  return (
    <main className="flex min-h-screen flex-col bg-background px-4 py-8 sm:py-12">
      <div className="mx-auto flex w-full max-w-[800px] flex-1 flex-col">
        <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2 text-[22px] md:text-[26px] font-semibold leading-[1.25] tracking-[-0.015em] text-primary-foreground">
            Tukar QR
          </h1>
          <p className="text-[14px] md:text-[16px] leading-[1.6] text-muted-foreground text-balance">
            Jadikan imej DuitNow QR kembali seperti asal
          </p>
        </div>

        {isDownloadRoute && singleResult && isSingleMode && isProcessingComplete && (
            <QrResultCardSingle
              resultCardRef={resultCardRef}
              qrPayload={singleResult.payload}
              qrFgColor={qrFgColor}
              qrStyle={qrStyle}
              showBankName={showBankName}
              outerBg={outerBg}
              exportRatio={exportRatio}
              alertDismissed={alertDismissed}
              onDismissAlert={dismissAlert}
              onDownload={() => {
                setDrawerAction("download");
                setConfigOpen(true);
              }}
              onCopy={() => {
                setDrawerAction("copy");
                setConfigOpen(true);
              }}
              svgRefCallback={(el) => {
                singleQrSvgRef.current = el;
              }}
              disabled={isDecoding}
            />
          )}

        {isDownloadRoute && results.length > 1 && successfulResults.length >= 1 && (
            <QrResultList
              resultCardRef={resultCardRef}
              results={successfulResults}
              qrFgColor={qrFgColor}
              qrStyle={qrStyle}
              showBankName={showBankName}
              outerBg={outerBg}
              exportRatio={exportRatio}
              alertDismissed={alertDismissed}
              onDismissAlert={dismissAlert}
              onConfigOpen={() => setConfigOpen(true)}
              disabled={isDecoding}
            />
          )}

        <QrUploadZone
          fileInputRef={fileInputRef}
          cameraInputRef={cameraInputRef}
          activeTab={activeTab}
          onTabChange={(val) => {
            setActiveTab(val);
            handleReset();
          }}
          onFilesSelect={handleFilesSelect}
          onDragOver={handleDragOver}
          items={results}
          onReset={handleReset}
          onRemoveItem={handleRemoveItem}
          defaultCollapsed={isProcessingComplete && !isSingleMode}
          isSingleMode={isSingleMode}
        />

        <canvas ref={canvasRef} className="hidden" />

        {isDesktop ? (
          <Dialog open={configOpen} onOpenChange={handleConfigOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Konfigurasi QR</DialogTitle>
                <DialogDescription>
                  Tetapkan reka bentuk dan resolusi imej QR
                </DialogDescription>
              </DialogHeader>
              <div className="flex w-full flex-col gap-5">
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
                        className="h-[80px] w-full min-w-0 flex flex-col gap-1 px-2 py-3"
                        onClick={() => setQrStyle("classic")}
                      >
                        <Square className="size-5 shrink-0" />
                        <span className="text-xs">Petak-Petak</span>
                      </Button>
                    </motion.div>
                    <motion.div
                      whileTap={{ scale: 0.96 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      className="min-w-0"
                    >
                      <Button
                        variant={qrStyle === "rounded" ? "default" : "outline"}
                        className="h-[80px] w-full min-w-0 flex flex-col gap-1 px-2 py-3"
                        onClick={() => setQrStyle("rounded")}
                      >
                        <Circle className="size-5 shrink-0" />
                        <span className="text-xs">Bulat-Bulat</span>
                      </Button>
                    </motion.div>
                  </div>
                </div>
                <div className="flex w-full items-center justify-between gap-4">
                  <label
                    htmlFor="show-bank-name"
                    className="text-sm font-medium shrink-0"
                  >
                    Papar nama bank
                  </label>
                  <Switch
                    id="show-bank-name"
                    checked={showBankName}
                    onCheckedChange={setShowBankName}
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
                        className="h-[80px] w-full min-w-0 flex flex-col gap-0.5 px-2 py-3"
                        onClick={() => setOuterBg("white")}
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
                        className="h-[80px] w-full min-w-0 flex flex-col gap-0.5 px-2 py-3"
                        onClick={() => setOuterBg("transparent")}
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
                        className="h-[64px] w-full min-w-0 flex flex-col gap-0.5 px-2 py-3"
                        onClick={() => setExportRatio("1:1")}
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
                        className="h-[64px] w-full min-w-0 flex flex-col gap-0.5 px-2 py-3"
                        onClick={() => setExportRatio("3:4")}
                      >
                        <span className="font-medium">3:4</span>
                      </Button>
                    </motion.div>
                  </div>
                </div>
                {drawerAction && (
                  <div className="flex flex-col sm:flex-row gap-2 pt-2">
                    <Button
                      onClick={() => executeSingleExport(drawerAction)}
                      className="w-full sm:flex-1 sm:min-w-0"
                    >
                      {drawerAction === "download"
                        ? "Muat Turun"
                        : "Salin Imej"}
                    </Button>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        ) : (
          <Drawer open={configOpen} onOpenChange={handleConfigOpenChange}>
            <DrawerContent>
              <div className="mx-auto w-full max-w-sm">
                <DrawerHeader>
                  <DrawerTitle>Konfigurasi QR</DrawerTitle>
                  <DrawerDescription>
                    Tetapkan reka bentuk dan resolusi imej QR
                  </DrawerDescription>
                </DrawerHeader>
                <div className="flex w-full flex-col gap-5 p-4">
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
                          className="h-[64px] w-full min-w-0 flex flex-col gap-1 px-2 py-3"
                          onClick={() => setQrStyle("classic")}
                        >
                          <Square className="size-5 shrink-0" />
                          <span className="text-xs">Petak-Petak</span>
                        </Button>
                      </motion.div>
                      <motion.div
                        whileTap={{ scale: 0.96 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        className="min-w-0"
                      >
                        <Button
                          variant={qrStyle === "rounded" ? "default" : "outline"}
                          className="h-[64px] w-full min-w-0 flex flex-col gap-1 px-2 py-3"
                          onClick={() => setQrStyle("rounded")}
                        >
                          <Circle className="size-5 shrink-0" />
                          <span className="text-xs">Bulat-Bulat</span>
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                  <div className="flex w-full items-center justify-between gap-4">
                    <label
                      htmlFor="show-bank-name-drawer"
                      className="text-sm font-medium shrink-0"
                    >
                      Papar nama bank
                    </label>
                    <Switch
                      id="show-bank-name-drawer"
                      checked={showBankName}
                      onCheckedChange={setShowBankName}
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
                          className="h-[64px] w-full min-w-0 flex flex-col gap-0.5 px-2 py-3"
                          onClick={() => setOuterBg("white")}
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
                          className="h-[64px] w-full min-w-0 flex flex-col gap-0.5 px-2 py-3"
                          onClick={() => setOuterBg("transparent")}
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
                          className="h-[64px] w-full min-w-0 flex flex-col gap-0.5 px-2 py-3"
                          onClick={() => setExportRatio("1:1")}
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
                          className="h-[64px] w-full min-w-0 flex flex-col gap-0.5 px-2 py-3"
                          onClick={() => setExportRatio("3:4")}
                        >
                          <span className="font-medium">3:4</span>
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                  {drawerAction && (
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button
                        onClick={() => executeSingleExport(drawerAction)}
                        className="w-full sm:flex-1 sm:min-w-0"
                      >
                        {drawerAction === "download"
                          ? "Muat Turun"
                          : "Salin Imej"}
                      </Button>
                    </div>
                  )}
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

        </div>

        {isHomeRoute && results.length === 0 && (
          <footer className="mt-auto pt-10 text-center text-[13px] text-muted-foreground">
            <nav className="flex items-center justify-center gap-6">
              <Link
                href="/about"
                className="hover:text-foreground transition-colors underline-offset-4 hover:underline"
              >
                Tentang
              </Link>
              <Link
                href="/list"
                className="hover:text-foreground transition-colors underline-offset-4 hover:underline"
              >
                Senarai Bank
              </Link>
            </nav>
          </footer>
        )}

      </div>
    </main>
  );
}
