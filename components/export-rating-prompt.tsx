"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/ui/star-rating";
import {
  getSavedRating,
  saveRating,
  submitRatingToDiscord,
} from "@/lib/export-rating";
import { shareApp } from "@/lib/share-app";

interface ExportRatingPromptProps {
  onClose: () => void;
}

export function ExportRatingPrompt({ onClose }: ExportRatingPromptProps) {
  const [rating, setRating] = useState<number | null>(() => getSavedRating());
  const hasRated = rating !== null;

  function handleRatingChange(value: number) {
    if (hasRated) return;
    setRating(value);
    saveRating(value);
    void submitRatingToDiscord(value);
  }

  async function handleShare() {
    try {
      await shareApp();
      onClose();
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      onClose();
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <StarRating
        value={rating}
        onChange={handleRatingChange}
        disabled={hasRated}
        aria-label="Berikan penilaian anda"
      />
      {hasRated && (
        <p className="text-center text-[13px] text-muted-foreground">
          Terima kasih atas maklum balas anda!
        </p>
      )}
      <Button
        onClick={handleShare}
        className="w-full focus:outline-none focus-visible:outline-none focus-visible:ring-0"
      >
        Kongsi dengan rakan
      </Button>
    </div>
  );
}
