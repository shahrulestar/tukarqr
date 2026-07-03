"use client";

import { Icon, StarIcon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  value: number | null;
  onChange: (value: number) => void;
  disabled?: boolean;
  "aria-label"?: string;
}

export function StarRating({
  value,
  onChange,
  disabled = false,
  "aria-label": ariaLabel = "Penilaian bintang",
}: StarRatingProps) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className="flex justify-center gap-1"
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = value !== null && star <= value;
        return (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={value === star ? "true" : "false"}
            aria-label={`${star} bintang`}
            disabled={disabled}
            onClick={() => onChange(star)}
            className={cn(
              "rounded-md p-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60",
              isFilled ? "text-primary" : "text-muted-foreground hover:text-primary"
            )}
          >
            <Icon
              icon={StarIcon}
              size={32}
              className={cn("size-8", isFilled && "fill-current")}
            />
          </button>
        );
      })}
    </div>
  );
}
