"use client";

import { useEffect, useState } from "react";
import { FileImage, CheckCircle2, X, XCircle, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ImagePreviewDialog } from "@/components/image-preview-dialog";

export type FileUploadStatus = "pending" | "decoding" | "success" | "failed";

interface FileUploadItemProps {
  fileName: string;
  status: FileUploadStatus;
  error?: string;
  onRemove?: () => void;
  file?: File;
  /** When true, pending items show loading icon (waiting in queue) */
  showLoadingForPending?: boolean;
  /** When true, allow image preview (only after all images finish decoding) */
  allowPreview?: boolean;
}

function LoadingSpinner({ className }: { className?: string }) {
  return (
    <Loader2
      className={cn("size-5 text-muted-foreground spinner-gpu", className)}
      aria-hidden
    />
  );
}

export function FileUploadItem({
  fileName,
  status,
  error,
  onRemove,
  file,
  showLoadingForPending = false,
  allowPreview = true,
}: FileUploadItemProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const truncatedName =
    fileName.length > 32 ? `${fileName.slice(0, 29)}...` : fileName;

  const effectiveStatus =
    status === "pending" && showLoadingForPending ? "decoding" : status;
  const isSpinning = effectiveStatus === "decoding";

  const canPreview =
    allowPreview && (status === "success" || status === "failed") && imageUrl;

  useEffect(() => {
    if (file && (status === "success" || status === "failed")) {
      const url = URL.createObjectURL(file);
      setImageUrl(url);
      return () => {
        URL.revokeObjectURL(url);
        setImageUrl(null);
      };
    }
    setImageUrl(null);
  }, [file, status]);

  function handleCardClick() {
    if (canPreview) setPreviewOpen(true);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (canPreview && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      setPreviewOpen(true);
    }
  }

  const cardClassName = cn(
    "relative flex flex-col gap-2 rounded-lg border border-border bg-muted/30 p-3 min-h-[52px]",
    canPreview && "cursor-pointer transition-colors hover:bg-muted/50"
  );

  const statusIcons = {
    pending: <FileImage className="size-5 text-muted-foreground" />,
    decoding: <LoadingSpinner />,
    success: <CheckCircle2 className="size-5 text-[oklch(0.80_0.18_152)]" />,
    failed: <XCircle className="size-5 text-[oklch(0.71_0.17_22)]" />,
  };

  const cardContent = (
    <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex size-9 shrink-0 items-center justify-center rounded-md",
              (effectiveStatus === "pending" || isSpinning) && "bg-muted/50",
              effectiveStatus === "success" && "bg-background",
              effectiveStatus === "failed" && "bg-background"
            )}
          >
            {statusIcons[effectiveStatus]}
          </div>
          <div className="min-w-0 flex-1">
            <p
              className="truncate text-[13px] font-medium text-foreground"
              title={fileName}
            >
              {truncatedName}
            </p>
            {error && status === "failed" && (
              <p className="mt-0.5 truncate text-[11px] text-[oklch(0.71_0.17_22)]">
                {error}
              </p>
            )}
          </div>
          {(status === "pending" || status === "decoding" || status === "failed") &&
            onRemove && (
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
                }}
                aria-label="Buang fail"
              >
                <X className="size-3" />
              </Button>
            )}
    </div>
  );

  return (
    <>
      {canPreview ? (
        <div
          role="button"
          tabIndex={0}
          onClick={handleCardClick}
          onKeyDown={handleKeyDown}
          className={cardClassName}
        >
          {cardContent}
        </div>
      ) : (
        <div className={cardClassName}>{cardContent}</div>
      )}
      <ImagePreviewDialog
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        src={imageUrl}
        alt={fileName}
      />
    </>
  );
}
