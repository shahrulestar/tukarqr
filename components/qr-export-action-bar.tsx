"use client";

import { Button, actionButtonClassName } from "@/components/ui/button";
import {
  Copy01Icon,
  Download01Icon,
  Icon,
  Share01Icon,
} from "@/components/ui/icon";
import { Spinner } from "@/components/ui/spinner";
import { useMediaQuery } from "@/hooks/use-media-query";
import type { QrExportAction } from "@/lib/qr-export-actions";
import { cn } from "@/lib/utils";

export const exportActionButtonClassName = actionButtonClassName;

interface QrExportActionBarProps {
  onDownload: () => void;
  onCopy: () => void;
  onShare: () => void;
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
  isLoading = false,
  loadingAction = null,
  disabled = false,
  className,
  layout = "compact",
}: QrExportActionBarProps) {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const isMobile = useMediaQuery("(max-width: 639px)");
  const showShare = !isDesktop;
  const isBusy = disabled || isLoading;

  if (layout === "compact") {
    return (
      <div
        className={cn(
          "flex w-full shrink-0 gap-2 md:w-auto md:ml-auto",
          className
        )}
      >
        <IconGhostButton
          icon={Download01Icon}
          label="Muat turun"
          onClick={onDownload}
          isActive={loadingAction === "download"}
          disabled={isBusy}
        />
        <IconGhostButton
          icon={Copy01Icon}
          label="Salin"
          onClick={onCopy}
          isActive={loadingAction === "copy"}
          disabled={isBusy}
        />
        {showShare && (
          <IconGhostButton
            icon={Share01Icon}
            label="Kongsi"
            onClick={onShare}
            isActive={loadingAction === "share"}
            disabled={isBusy}
          />
        )}
      </div>
    );
  }

  const stackOnMobile = isMobile;
  const columnCount = showShare ? 3 : 2;

  return (
    <div
      className={cn(
        "w-full min-w-0 gap-2",
        stackOnMobile
          ? "flex flex-col"
          : columnCount === 2
            ? "grid grid-cols-2"
            : "grid grid-cols-3",
        className
      )}
    >
      <LabelButton
        label="Muat turun"
        onClick={onDownload}
        isActive={loadingAction === "download"}
        disabled={isBusy}
        variant="default"
      />
      <LabelButton
        label="Salin"
        onClick={onCopy}
        isActive={loadingAction === "copy"}
        disabled={isBusy}
      />
      {showShare && (
        <LabelButton
          label="Kongsi"
          onClick={onShare}
          isActive={loadingAction === "share"}
          disabled={isBusy}
        />
      )}
    </div>
  );
}
