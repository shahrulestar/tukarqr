"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
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
  contentKey?: string;
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
  contentKey,
}: ResponsiveModalProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

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
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      repositionInputs={false}
      fixed={keyboardAware}
    >
      <DrawerContent
        className={cn(
          fitContent && "h-auto !max-h-none",
          keyboardAware && "max-h-[85dvh]"
        )}
      >
        <div
          key={contentKey}
          className={cn(
            "mx-auto w-full max-w-sm",
            keyboardAware &&
              "max-h-[calc(85dvh-5rem)] overflow-y-auto overscroll-contain"
          )}
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
