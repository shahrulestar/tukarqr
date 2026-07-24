"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button, actionButtonClassName } from "@/components/ui/button";
import { StarRating } from "@/components/ui/star-rating";
import { Textarea } from "@/components/ui/textarea";
import {
  getSavedRating,
  hasSubmittedRating,
  isValidRatingFeedback,
  MIN_RATING_FEEDBACK_LENGTH,
  needsRatingFeedback,
  RATING_WEBHOOK_NOT_CONFIGURED_ERROR,
  saveRating,
  submitRatingToDiscord,
} from "@/lib/export-rating";
import { cn } from "@/lib/utils";
import { shareApp } from "@/lib/share-app";
import { useT } from "@/lib/i18n";

function getRatingSubmitErrorMessage(
  error: unknown,
  t: (key: string) => string
): string {
  if (
    error instanceof Error &&
    error.message === RATING_WEBHOOK_NOT_CONFIGURED_ERROR
  ) {
    return t("rating.toast.webhookMissing");
  }

  return t("rating.toast.retry");
}

export type RatingContentPhase = "initial" | "feedback" | "complete";

interface ExportRatingPromptProps {
  onClose: () => void;
  onContentPhaseChange?: (phase: RatingContentPhase) => void;
}

export function ExportRatingPrompt({
  onClose,
  onContentPhaseChange,
}: ExportRatingPromptProps) {
  const t = useT();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [rating, setRating] = useState<number | null>(() => getSavedRating());
  const [feedback, setFeedback] = useState("");
  const [showFeedbackError, setShowFeedbackError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(() => hasSubmittedRating());

  const showFeedbackForm =
    rating !== null && needsRatingFeedback(rating) && !submitted;
  const showShareStep = submitted;
  const canSubmitFeedback =
    showFeedbackForm && isValidRatingFeedback(feedback) && !isSubmitting;

  const contentPhase: RatingContentPhase = showShareStep
    ? "complete"
    : showFeedbackForm
      ? "feedback"
      : "initial";

  useEffect(() => {
    onContentPhaseChange?.(contentPhase);
  }, [contentPhase, onContentPhaseChange]);

  useEffect(() => {
    if (showShareStep) textareaRef.current?.blur();
  }, [showShareStep]);

  async function handleRatingChange(value: number) {
    if (submitted) return;

    setRating(value);
    setShowFeedbackError(false);
    setFeedback("");

    if (needsRatingFeedback(value)) return;

    setSubmitted(true);
    try {
      await submitRatingToDiscord(value);
      saveRating(value);
    } catch (error) {
      setSubmitted(false);
      setRating(null);
      toast.error(t("rating.toast.submitFail.title"), {
        description: getRatingSubmitErrorMessage(error, t),
      });
    }
  }

  async function handleFeedbackSubmit() {
    if (!rating || !showFeedbackForm || isSubmitting) return;

    if (!isValidRatingFeedback(feedback)) {
      setShowFeedbackError(true);
      return;
    }

    setIsSubmitting(true);
    try {
      await submitRatingToDiscord(rating, feedback);
      saveRating(rating);
      setSubmitted(true);
    } catch (error) {
      toast.error(t("rating.toast.feedbackFail.title"), {
        description: getRatingSubmitErrorMessage(error, t),
      });
    } finally {
      setIsSubmitting(false);
    }
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
        disabled={submitted}
        aria-label={t("rating.stars.aria")}
      />

      {showFeedbackForm && (
        <div className="flex flex-col gap-2">
          <label
            htmlFor="rating-feedback"
            className="text-[13px] font-medium text-foreground"
          >
            {t("rating.feedback.label")}
          </label>
          <Textarea
            ref={textareaRef}
            id="rating-feedback"
            value={feedback}
            onChange={(event) => {
              setFeedback(event.target.value);
              if (
                showFeedbackError &&
                isValidRatingFeedback(event.target.value)
              ) {
                setShowFeedbackError(false);
              }
            }}
            placeholder={t("rating.feedback.placeholder")}
            minLength={MIN_RATING_FEEDBACK_LENGTH}
            aria-invalid={showFeedbackError}
            aria-describedby={
              showFeedbackError ? "rating-feedback-error" : undefined
            }
            disabled={isSubmitting}
            onFocus={() => {
              requestAnimationFrame(() => {
                textareaRef.current?.scrollIntoView({
                  block: "nearest",
                  inline: "nearest",
                });
              });
            }}
          />
          {showFeedbackError && (
            <p
              id="rating-feedback-error"
              className="text-[12px] text-destructive"
            >
              {t("rating.feedback.minLength", {
                n: MIN_RATING_FEEDBACK_LENGTH,
              })}
            </p>
          )}
          <Button
            size="lg"
            onClick={handleFeedbackSubmit}
            disabled={!canSubmitFeedback}
            className={cn(
              actionButtonClassName,
              "focus:outline-none focus-visible:outline-none focus-visible:ring-0"
            )}
          >
            {isSubmitting
              ? t("rating.feedback.submitting")
              : t("rating.feedback.submit")}
          </Button>
        </div>
      )}

      {showShareStep && (
        <>
          <p className="text-center text-[13px] text-muted-foreground">
            {t("rating.thanks")}
          </p>
          <Button
            size="lg"
            onClick={handleShare}
            className={cn(
              actionButtonClassName,
              "focus:outline-none focus-visible:outline-none focus-visible:ring-0"
            )}
          >
            {t("rating.share")}
          </Button>
        </>
      )}
    </div>
  );
}
