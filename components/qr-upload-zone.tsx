"use client";

import { ImageIcon, Scan, X } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface QrUploadZoneProps {
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  cameraInputRef: React.RefObject<HTMLInputElement | null>;
  activeTab: string;
  onTabChange: (value: string) => void;
  onFileSelect: (file: File, options?: { fromCamera?: boolean }) => void;
  onDrop: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  originalImage: string | null;
  onReset: () => void;
}

export function QrUploadZone({
  fileInputRef,
  cameraInputRef,
  activeTab,
  onTabChange,
  onFileSelect,
  onDrop,
  onDragOver,
  originalImage,
  onReset,
}: QrUploadZoneProps) {
  return (
    <Card>
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

          <TabsContent value="upload" className="mt-4">
            <div
              onDrop={onDrop}
              onDragOver={onDragOver}
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
                      onReset();
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
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) onFileSelect(file);
                }}
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
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) onFileSelect(file, { fromCamera: true });
                }}
              />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
