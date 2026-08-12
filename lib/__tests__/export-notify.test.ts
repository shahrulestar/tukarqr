import { afterEach, describe, expect, it, vi } from "vitest";
import {
  buildExportEmbedDescription,
  notifyExportToDiscord,
} from "../export-notify";

vi.mock("@/lib/site-config", () => ({
  DISCORD_RATING_WEBHOOK_URL: "https://discord.test/webhook",
}));

describe("buildExportEmbedDescription", () => {
  it("returns save message", () => {
    expect(buildExportEmbedDescription("save")).toBe("User saved a QR");
  });

  it("returns share message", () => {
    expect(buildExportEmbedDescription("share")).toBe("User shared a QR");
  });
});

describe("notifyExportToDiscord", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("posts multipart payload_json for save", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, type: "opaque" });
    vi.stubGlobal("fetch", fetchMock);

    await notifyExportToDiscord("save");

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
          title: "TukarQR export",
          description: "User saved a QR",
          color: 5814783,
        },
      ],
    });
  });

  it("posts multipart payload_json for share", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, type: "opaque" });
    vi.stubGlobal("fetch", fetchMock);

    await notifyExportToDiscord("share");

    const [, options] = fetchMock.mock.calls[0] as [
      string,
      { body: FormData },
    ];

    const payload = JSON.parse(
      (options.body as FormData).get("payload_json") as string
    );

    expect(payload.embeds[0].description).toBe("User shared a QR");
  });

  it("skips fetch when webhook url is empty", async () => {
    vi.resetModules();
    vi.doMock("@/lib/site-config", () => ({
      DISCORD_RATING_WEBHOOK_URL: "",
    }));

    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const { notifyExportToDiscord: notifyWithoutWebhook } = await import(
      "../export-notify"
    );

    await notifyWithoutWebhook("save");

    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("does not throw when fetch fails", async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error("network error"));
    vi.stubGlobal("fetch", fetchMock);

    await expect(notifyExportToDiscord("share")).resolves.toBeUndefined();
  });
});
