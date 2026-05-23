import { DISCORD_RATING_WEBHOOK_URL } from "@/lib/site-config";

const RATING_SUBMITTED_KEY = "qrkita-rating-submitted";
const RATING_VALUE_KEY = "qrkita-rating-value";

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

export async function submitRatingToDiscord(value: number): Promise<void> {
  if (!DISCORD_RATING_WEBHOOK_URL) return;

  await fetch(DISCORD_RATING_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      embeds: [
        {
          title: "Penilaian TukarQR",
          description: `Pengguna memberi ${value}/5 bintang`,
          color: 5814783,
        },
      ],
    }),
  });
}
