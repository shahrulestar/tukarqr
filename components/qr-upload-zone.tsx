"use client";

import { useEffect, useState } from "react";
import {
  ImageIcon,
  Scan,
  ChevronDown,
  ChevronUp,
  Trash,
} from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMac } from "@/hooks/use-is-mac";
import { useMediaQuery } from "@/hooks/use-media-query";

import {
  FileUploadItem,
  type FileUploadStatus,
} from "@/components/file-upload-item";
import { Button } from "@/components/ui/button";

export interface UploadItem {
  id: string;
  file: File;
  status: FileUploadStatus;
  progress: number;
  error?: string;
}

interface QrUploadZoneProps {
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  cameraInputRef: React.RefObject<HTMLInputElement | null>;
  activeTab: string;
  onTabChange: (value: string) => void;
  onFilesSelect: (files: File[]) => void;
  onDragOver: (e: React.DragEvent) => void;
  items: UploadItem[];
  onReset: () => void;
  onRemoveItem?: (id: string) => void;
  defaultCollapsed?: boolean;
  isSingleMode?: boolean;
}

const IMAGE_ACCEPT = "image/*,.heic,.heif,.avif";

function filterImageFiles(files: FileList | null): File[] {
  if (!files?.length) return [];
  return Array.from(files).filter(
    (f) => f.type?.startsWith("image/") || /\.(heic|heif|avif)(\?.*)?$/i.test(f.name)
  );
}

export function QrUploadZone({
  fileInputRef,
  cameraInputRef,
  activeTab,
  onTabChange,
  onFilesSelect,
  onDragOver,
  items,
  onReset,
  onRemoveItem,
  defaultCollapsed = false,
  isSingleMode = false,
}: QrUploadZoneProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const isMac = useIsMac();
  const [expanded, setExpanded] = useState(!defaultCollapsed);

  const successItems = items.filter((i) => i.status === "success");
  const failedItems = items.filter((i) => i.status === "failed");
  const processingItems = items.filter(
    (i) => i.status === "pending" || i.status === "decoding"
  );

  useEffect(() => {
    if (defaultCollapsed) setExpanded(false);
    else if (processingItems.length > 0) setExpanded(true);
  }, [defaultCollapsed, processingItems.length]);
  const isProcessingComplete =
    items.length > 0 && processingItems.length === 0;
  const showCollapsed =
    isProcessingComplete && items.length > 0 && !isSingleMode;

  useEffect(() => {
    if (activeTab !== "upload") return;

    function handlePaste(e: ClipboardEvent) {
      const files = e.clipboardData?.files;
      if (!files?.length) return;
      const imageFiles = filterImageFiles(files);
      if (!imageFiles.length) return;
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      )
        return;
      e.preventDefault();
      onFilesSelect(imageFiles);
    }

    document.addEventListener("paste", handlePaste);
    return () => document.removeEventListener("paste", handlePaste);
  }, [activeTab, onFilesSelect]);

  function handlePasteOnZone(e: React.ClipboardEvent) {
    const files = e.clipboardData?.files;
    if (files?.length) {
      const imageFiles = filterImageFiles(files);
      if (imageFiles.length) {
        e.preventDefault();
        onFilesSelect(imageFiles);
      }
    }
  }

  function handleFileInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (files?.length) {
      onFilesSelect(Array.from(files));
    }
    e.target.value = "";
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const imageFiles = filterImageFiles(e.dataTransfer.files);
    if (imageFiles.length) {
      onFilesSelect(imageFiles);
    } else if (e.dataTransfer.files?.length) {
      toast.error("Ralat", {
        description: "Sila seret fail imej sahaja (JPG, PNG, HEIC, dll.).",
      });
    }
  }

  return (
    <Card className="[transform:translateZ(0)] [contain:layout_style_paint]">
      <CardHeader>
        <CardTitle className="text-[16px] md:text-[18px]">
          Imbas DuitNow QR
        </CardTitle>
        <CardDescription className="text-[13px] md:text-[14px] leading-[1.55]">
          Muat naik DuitNow QR untuk versi lebih jelas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={onTabChange}>
          <TabsList>
            <TabsTrigger value="upload">Muat naik</TabsTrigger>
            <TabsTrigger value="camera">Kamera</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="mt-4 space-y-4">
            <div
              role="button"
              tabIndex={0}
              onDrop={handleDrop}
              onDragOver={onDragOver}
              onPaste={handlePasteOnZone}
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  fileInputRef.current?.click();
                }
              }}
              className="group relative flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-border bg-muted/30 p-8 transition-colors hover:border-primary/50 hover:bg-muted/50 min-h-[220px]"
              aria-label="Muat naik imej QR. Letak imej di sini atau tekan Ctrl+V untuk tampal."
            >
              <>
                <div className="rounded-full bg-muted/50 p-3">
                  <ImageIcon className="size-6 text-muted-foreground" />
                </div>
                <p className="text-[12px] md:text-[13px] font-medium tracking-[0.01em] text-foreground text-center">
                  Letak imej DuitNow QR di sini
                </p>
                <p className="text-[12px] leading-[1.45] tracking-[0.02em] text-muted-foreground text-center flex flex-wrap items-center justify-center gap-1">
                  {isDesktop ? (
                    <>
                      atau tekan{" "}
                      <KbdGroup className="inline-flex">
                        <Kbd>{isMac ? "⌘" : "Ctrl"}</Kbd>
                        <Kbd>V</Kbd>
                      </KbdGroup>{" "}
                      untuk tampal
                    </>
                  ) : (
                    "atau klik untuk mengimport"
                  )}
                </p>
              </>
              <input
                ref={fileInputRef}
                type="file"
                accept={IMAGE_ACCEPT}
                multiple
                aria-label="Muat naik imej QR"
                className="hidden"
                onChange={handleFileInputChange}
              />
            </div>

            {items.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex flex-col gap-0.5">
                    <p className="text-[13px] font-medium text-muted-foreground">
                      {successItems.length}/10 Imej
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    {showCollapsed && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpanded((v) => !v);
                        }}
                        aria-expanded={expanded}
                      >
                        {expanded ? (
                          <>
                            Sembunyikan
                            <ChevronUp className="size-3.5" />
                          </>
                        ) : (
                          <>
                            Tunjuk
                            <ChevronDown className="size-3.5" />
                          </>
                        )}
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onReset();
                      }}
                      aria-label="Buang Semua"
                    >
                      <Trash className="size-4" />
                    </Button>
                  </div>
                </div>
                {expanded && (
                  <div className="space-y-3">
                    {processingItems.length > 0 ? (
                      <div className="space-y-2">
                        {items.map((item) => (
                          <FileUploadItem
                            key={item.id}
                            fileName={item.file.name}
                            status={item.status}
                            error={item.error}
                            file={item.file}
                            showLoadingForPending
                            allowPreview={false}
                            onRemove={
                              onRemoveItem
                                ? () => onRemoveItem(item.id)
                                : undefined
                            }
                          />
                        ))}
                      </div>
                    ) : (
                      <>
                        {successItems.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                              Selesai ({successItems.length})
                            </p>
                            {successItems.map((item) => (
                              <FileUploadItem
                                key={item.id}
                                fileName={item.file.name}
                                status={item.status}
                                error={item.error}
                                file={item.file}
                                allowPreview={isProcessingComplete}
                                onRemove={
                                  onRemoveItem
                                    ? () => onRemoveItem(item.id)
                                    : undefined
                                }
                              />
                            ))}
                          </div>
                        )}
                        {failedItems.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                              Ralat ({failedItems.length})
                            </p>
                            {failedItems.map((item) => (
                              <FileUploadItem
                                key={item.id}
                                fileName={item.file.name}
                                status={item.status}
                                error={item.error}
                                file={item.file}
                                allowPreview={isProcessingComplete}
                                onRemove={
                                  onRemoveItem
                                    ? () => onRemoveItem(item.id)
                                    : undefined
                                }
                              />
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="camera" className="mt-4">
            <div
              onClick={() => cameraInputRef.current?.click()}
              className="group relative flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-border bg-muted/30 p-8 transition-colors hover:border-primary/50 hover:bg-muted/50 min-h-[220px]"
            >
              <div className="rounded-full bg-muted/50 p-3">
                <Scan className="size-6 text-muted-foreground" />
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
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) onFilesSelect([file]);
                }}
              />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
