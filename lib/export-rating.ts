import { DISCORD_RATING_WEBHOOK_URL } from "@/lib/site-config";

const RATING_SUBMITTED_KEY = "qrkita-rating-submitted";
const RATING_VALUE_KEY = "qrkita-rating-value";

export const MIN_RATING_FEEDBACK_LENGTH = 10;
export const RATING_WEBHOOK_NOT_CONFIGURED_ERROR =
  "RATING_WEBHOOK_NOT_CONFIGURED";

export function isRatingWebhookConfigured(): boolean {
  return DISCORD_RATING_WEBHOOK_URL.length > 0;
}

export function hasSubmittedRating(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(RATING_SUBMITTED_KEY) === "true";
}

export function getSavedRating(): number | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(RATING_VALUE_KEY);
  if (!raw) return null;
  const value = Number(raw);
  return value >= 1 && value <= 5 ? value : null;
}

export function saveRating(value: number): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(RATING_SUBMITTED_KEY, "true");
  localStorage.setItem(RATING_VALUE_KEY, String(value));
}

export function clearSubmittedRating(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(RATING_SUBMITTED_KEY);
  localStorage.removeItem(RATING_VALUE_KEY);
}

export function needsRatingFeedback(value: number): boolean {
  return value >= 1 && value <= 3;
}

export function isValidRatingFeedback(feedback: string): boolean {
  return feedback.trim().length >= MIN_RATING_FEEDBACK_LENGTH;
}

export function buildRatingEmbedDescription(
  value: number,
  feedback?: string
): string {
  const lines = [`Pengguna memberi ${value}/5 bintang`];
  if (feedback?.trim()) {
    lines.push("", "Maklum balas:", feedback.trim());
  }
  return lines.join("\n");
}

function buildDiscordPayload(value: number, feedback?: string) {
  return {
    embeds: [
      {
        title: "Penilaian TukarQR",
        description: buildRatingEmbedDescription(value, feedback),
        color: 5814783,
      },
    ],
  };
}

export async function submitRatingToDiscord(
  value: number,
  feedback?: string
): Promise<void> {
  if (!DISCORD_RATING_WEBHOOK_URL) {
    throw new Error(RATING_WEBHOOK_NOT_CONFIGURED_ERROR);
  }

  // Discord webhooks block browser CORS preflight for application/json.
  // Multipart FormData is a "simple" request and delivers without preflight.
  const formData = new FormData();
  formData.append("payload_json", JSON.stringify(buildDiscordPayload(value, feedback)));

  await fetch(DISCORD_RATING_WEBHOOK_URL, {
    method: "POST",
    body: formData,
    mode: "no-cors",
  });
}
