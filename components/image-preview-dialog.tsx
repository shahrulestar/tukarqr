"use client";

import { XIcon, Loader2 } from "lucide-react";
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
          className={cn(
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "fixed inset-0 z-50 flex items-center justify-center p-4 outline-none pointer-events-none",
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
              className={cn(
                "data-[state=open]:animate-in data-[state=closed]:animate-out",
                "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
                "duration-300 image-preview-scale flex items-center justify-center pointer-events-auto w-fit h-fit max-w-[90vw] max-h-[90vh]"
              )}
            >
              {isLoading ? (
                <div className="flex size-32 items-center justify-center">
                  <Loader2 className="size-10 animate-spin text-white" />
                </div>
              ) : src ? (
                <img
                  src={src}
                  alt={alt}
                  className="max-h-[90vh] max-w-[90vw] w-auto h-auto object-contain rounded-lg [-webkit-touch-callout:default] [-webkit-user-select:auto] [user-select:auto]"
                  loading="eager"
                />
              ) : null}
            </div>
          )}
          <DialogPrimitive.Close
            className="absolute right-6 top-6 rounded-full bg-primary p-2.5 text-primary-foreground shadow-sm hover:bg-primary/90 focus:outline-none disabled:pointer-events-none [&_svg]:size-5 pointer-events-auto"
            aria-label="Tutup pratonton"
          >
            <XIcon />
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}
