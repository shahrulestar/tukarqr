import { HugeiconsIcon } from "@hugeicons/react";
import {
  Alert02Icon,
  AlertCircleIcon,
  ArrowDown01Icon,
  ArrowLeft01Icon,
  ArrowUp01Icon,
  Cancel01Icon,
  CheckmarkCircle01Icon,
  ClipboardPasteIcon,
  Copy01Icon,
  Delete02Icon,
  Download01Icon,
  DragDropVerticalIcon,
  FileImageIcon,
  Image01Icon,
  InformationCircleIcon,
  Loading03Icon,
  OctagonXIcon,
  QrCodeScanIcon,
  ScanIcon,
  Settings01Icon,
  Share01Icon,
  Shield01Icon,
  StarIcon,
} from "@hugeicons/core-free-icons";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

type IconData = ComponentProps<typeof HugeiconsIcon>["icon"];

export type IconProps = Omit<ComponentProps<typeof HugeiconsIcon>, "icon"> & {
  icon: IconData;
};

export function Icon({
  icon,
  size = 16,
  strokeWidth = 1.75,
  className,
  ...props
}: IconProps) {
  return (
    <HugeiconsIcon
      icon={icon}
      size={size}
      color="currentColor"
      strokeWidth={strokeWidth}
      className={cn("shrink-0", className)}
      {...props}
    />
  );
}

export function LoaderIcon({
  className,
  size = 16,
  ...props
}: Omit<IconProps, "icon">) {
  return (
    <Icon
      icon={Loading03Icon}
      size={size}
      className={cn("animate-spin", className)}
      aria-label="Loading"
      role="status"
      {...props}
    />
  );
}

export {
  Alert02Icon,
  AlertCircleIcon,
  ArrowDown01Icon,
  ArrowLeft01Icon,
  ArrowUp01Icon,
  Cancel01Icon,
  CheckmarkCircle01Icon,
  ClipboardPasteIcon,
  Copy01Icon,
  Delete02Icon,
  Download01Icon,
  DragDropVerticalIcon,
  FileImageIcon,
  Image01Icon,
  InformationCircleIcon,
  Loading03Icon,
  OctagonXIcon,
  QrCodeScanIcon,
  ScanIcon,
  Settings01Icon,
  Share01Icon,
  Shield01Icon,
  StarIcon,
};
