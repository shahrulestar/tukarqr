import { afterEach, describe, expect, it, vi } from "vitest";
import {
  buildRatingEmbedDescription,
  isValidRatingFeedback,
  needsRatingFeedback,
  RATING_WEBHOOK_NOT_CONFIGURED_ERROR,
  submitRatingToDiscord,
} from "../export-rating";

vi.mock("@/lib/site-config", () => ({
  DISCORD_RATING_WEBHOOK_URL: "https://discord.test/webhook",
}));

describe("needsRatingFeedback", () => {
  it("returns true for ratings 1 through 3", () => {
    expect(needsRatingFeedback(1)).toBe(true);
    expect(needsRatingFeedback(2)).toBe(true);
    expect(needsRatingFeedback(3)).toBe(true);
  });

  it("returns false for ratings 4 and 5", () => {
    expect(needsRatingFeedback(4)).toBe(false);
    expect(needsRatingFeedback(5)).toBe(false);
  });
});

describe("isValidRatingFeedback", () => {
  it("requires at least 10 trimmed characters", () => {
    expect(isValidRatingFeedback("pendek")).toBe(false);
    expect(isValidRatingFeedback("123456789")).toBe(false);
    expect(isValidRatingFeedback("1234567890")).toBe(true);
    expect(isValidRatingFeedback("  1234567890  ")).toBe(true);
  });
});

describe("buildRatingEmbedDescription", () => {
  it("includes only the star value when feedback is absent", () => {
    expect(buildRatingEmbedDescription(5)).toBe("Pengguna memberi 5/5 bintang");
  });

  it("includes feedback when provided", () => {
    expect(buildRatingEmbedDescription(2, "QR lambat dimuat turun")).toBe(
      "Pengguna memberi 2/5 bintang\n\nMaklum balas:\nQR lambat dimuat turun"
    );
  });
});

describe("submitRatingToDiscord", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("posts multipart payload_json to avoid browser CORS preflight", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, type: "opaque" });
    vi.stubGlobal("fetch", fetchMock);

    await submitRatingToDiscord(2, "QR lambat dimuat turun");

    expect(fetchMock).toHaveBeenCalledTimes(1);

    const [url, options] = fetchMock.mock.calls[0] as [
      string,
      { method: string; body: FormData; mode: string },
    ];

    expect(url).toBe("https://discord.test/webhook");
    expect(options.method).toBe("POST");
    expect(options.mode).toBe("no-cors");
    expect(options.body).toBeInstanceOf(FormData);

    const payload = JSON.parse(
      (options.body as FormData).get("payload_json") as string
    );

    expect(payload).toEqual({
      embeds: [
        {
          title: "Penilaian TukarQR",
          description:
            "Pengguna memberi 2/5 bintang\n\nMaklum balas:\nQR lambat dimuat turun",
          color: 5814783,
        },
      ],
    });
  });

  it("throws when webhook url is empty", async () => {
    vi.resetModules();
    vi.doMock("@/lib/site-config", () => ({
      DISCORD_RATING_WEBHOOK_URL: "",
    }));

    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const { submitRatingToDiscord: submitWithoutWebhook } = await import(
      "../export-rating"
    );

    await expect(submitWithoutWebhook(4)).rejects.toThrow(
      RATING_WEBHOOK_NOT_CONFIGURED_ERROR
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
