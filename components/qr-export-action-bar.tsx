"use client";

import { useState } from "react";

import { Button, actionButtonClassName } from "@/components/ui/button";
import {
  Download01Icon,
  Icon,
} from "@/components/ui/icon";
import { Spinner } from "@/components/ui/spinner";
import { QrExportActionSheet } from "@/components/qr-export-action-sheet";
import { useMediaQuery } from "@/hooks/use-media-query";
import type { QrExportAction } from "@/lib/qr-export-actions";
import { cn } from "@/lib/utils";

export const exportActionButtonClassName = actionButtonClassName;

interface QrExportActionBarProps {
  onDownload: () => void;
  onCopy: () => void;
  onShare: () => void;
  onConfigOpen?: () => void;
  isLoading?: boolean;
  loadingAction?: QrExportAction | null;
  disabled?: boolean;
  className?: string;
  layout?: "main" | "compact";
}

function LabelButton({
  label,
  onClick,
  isActive,
  disabled,
  variant = "outline",
}: {
  label: string;
  onClick: () => void;
  isActive: boolean;
  disabled?: boolean;
  variant?: "default" | "outline";
}) {
  return (
    <Button
      type="button"
      variant={variant}
      size="lg"
      className={exportActionButtonClassName}
      onClick={onClick}
      disabled={disabled}
    >
      {isActive ? <Spinner /> : label}
    </Button>
  );
}

function IconGhostButton({
  icon,
  label,
  onClick,
  isActive,
  disabled,
}: {
  icon: React.ComponentProps<typeof Icon>["icon"];
  label: string;
  onClick: () => void;
  isActive: boolean;
  disabled?: boolean;
}) {
  return (
    <Button
      type="button"
      size="icon-sm"
      variant="ghost"
      className="flex-1 md:flex-none"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
    >
      {isActive ? (
        <Spinner className="size-4" />
      ) : (
        <Icon icon={icon} size={16} className="size-4" />
      )}
    </Button>
  );
}

export function QrExportActionBar({
  onDownload,
  onCopy,
  onShare,
  onConfigOpen,
  isLoading = false,
  loadingAction = null,
  disabled = false,
  className,
  layout = "compact",
}: QrExportActionBarProps) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const showShare = !isDesktop;
  const isBusy = disabled || isLoading;

  function openSheet() {
    if (!isBusy) setSheetOpen(true);
  }

  const actionSheet = (
    <QrExportActionSheet
      open={sheetOpen}
      onOpenChange={setSheetOpen}
      onDownload={onDownload}
      onCopy={onCopy}
      onShare={onShare}
      onConfigOpen={onConfigOpen}
      disabled={disabled}
      showShare={showShare}
    />
  );

  if (layout === "compact") {
    return (
      <>
        <div
          className={cn(
            "flex w-full shrink-0 md:w-auto md:ml-auto",
            className
          )}
        >
          <IconGhostButton
            icon={Download01Icon}
            label="Muat turun"
            onClick={openSheet}
            isActive={false}
            disabled={isBusy}
          />
        </div>
        {actionSheet}
      </>
    );
  }

  return (
    <>
      <div className={cn("w-full min-w-0", className)}>
        <LabelButton
          label="Muat turun"
          onClick={openSheet}
          isActive={false}
          disabled={isBusy}
          variant="default"
        />
      </div>
      {actionSheet}
    </>
  );
}
