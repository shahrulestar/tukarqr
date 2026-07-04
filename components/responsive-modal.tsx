"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useKeyboardInset } from "@/hooks/use-keyboard-inset";
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

interface ResponsiveModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  keyboardAware?: boolean;
  fitContent?: boolean;
}

export function ResponsiveModal({
  open,
  onOpenChange,
  title,
  description,
  children,
  className,
  keyboardAware = false,
  fitContent = false,
}: ResponsiveModalProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const keyboardInset = useKeyboardInset(keyboardAware && open);

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className={className ?? "sm:max-w-[425px]"}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            {description && (
              <DialogDescription>{description}</DialogDescription>
            )}
          </DialogHeader>
          {children}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange} repositionInputs={false}>
      <DrawerContent
        className={cn(
          fitContent && "h-auto !max-h-none",
          keyboardAware &&
            "h-auto !max-h-none transition-[bottom,max-height] duration-150 ease-out"
        )}
        style={
          keyboardInset.isKeyboardOpen
            ? {
                bottom: keyboardInset.bottom,
                maxHeight: Math.max(240, keyboardInset.visibleHeight - 12),
              }
            : undefined
        }
      >
        <div
          className={cn(
            "mx-auto w-full max-w-sm",
            keyboardInset.isKeyboardOpen &&
              "overflow-y-auto overscroll-contain [-webkit-overflow-scrolling:touch]"
          )}
          style={
            keyboardInset.isKeyboardOpen
              ? {
                  maxHeight: Math.max(200, keyboardInset.visibleHeight - 96),
                }
              : undefined
          }
        >
          <DrawerHeader>
            <DrawerTitle>{title}</DrawerTitle>
            {description && (
              <DrawerDescription>{description}</DrawerDescription>
            )}
          </DrawerHeader>
          <div className={cn("p-4", className)}>{children}</div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
