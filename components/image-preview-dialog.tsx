"use client";

import { LoaderIcon } from "@/components/ui/icon";
import { Dialog as DialogPrimitive } from "radix-ui";

import {
  Dialog,
  DialogPortal,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface ImagePreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  src: string | null;
  alt?: string;
  isLoading?: boolean;
}

export function ImagePreviewDialog({
  open,
  onOpenChange,
  src,
  alt = "Pratonton imej",
  isLoading = false,
}: ImagePreviewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogPrimitive.Overlay
          className={cn(
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "fixed inset-0 z-50 bg-black/80 dark:bg-black/90 duration-300",
            "image-preview-scale cursor-pointer"
          )}
          onClick={() => onOpenChange(false)}
        />
        <DialogPrimitive.Content
          onOpenAutoFocus={(e) => e.preventDefault()}
          onClick={() => onOpenChange(false)}
          className={cn(
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "fixed inset-0 z-50 flex cursor-pointer items-center justify-center p-4 outline-none",
            "duration-300 image-preview-scale"
          )}
        >
          <DialogTitle className="sr-only">{alt}</DialogTitle>
          <DialogDescription className="sr-only">
            Klik di luar atau tekan Escape untuk tutup
          </DialogDescription>
          {open && (
            <div
              data-state={open ? "open" : "closed"}
              onClick={(e) => e.stopPropagation()}
              className={cn(
                "data-[state=open]:animate-in data-[state=closed]:animate-out",
                "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
                "duration-300 image-preview-scale flex cursor-default items-center justify-center w-fit h-fit max-w-[min(75vw,560px)] max-h-[min(75vh,560px)]"
              )}
            >
              {isLoading ? (
                <div className="flex size-32 items-center justify-center">
                  <LoaderIcon size={40} className="size-10 text-white" />
                </div>
              ) : src ? (
                <img
                  src={src}
                  alt={alt}
                  className="max-h-[min(75vh,560px)] max-w-[min(75vw,560px)] w-auto h-auto object-contain rounded-md [-webkit-touch-callout:default] [-webkit-user-select:auto] [user-select:auto]"
                  loading="eager"
                />
              ) : null}
            </div>
          )}
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}
