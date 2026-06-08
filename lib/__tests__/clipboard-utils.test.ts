import { afterEach, describe, expect, it, vi } from "vitest";
import { readImageFromClipboard } from "../clipboard-utils";

describe("readImageFromClipboard", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns unsupported when clipboard.read is unavailable", async () => {
    vi.stubGlobal("window", { isSecureContext: true });
    vi.stubGlobal("navigator", { clipboard: {} });

    const result = await readImageFromClipboard();
    expect(result).toEqual({ ok: false, reason: "unsupported" });
  });

  it("returns unsupported when not in a secure context", async () => {
    vi.stubGlobal("window", { isSecureContext: false });
    vi.stubGlobal("navigator", { clipboard: { read: vi.fn() } });

    const result = await readImageFromClipboard();
    expect(result).toEqual({ ok: false, reason: "unsupported" });
  });

  it("returns denied when permission is rejected", async () => {
    vi.stubGlobal("window", { isSecureContext: true });
    vi.stubGlobal("navigator", {
      clipboard: {
        read: vi.fn().mockRejectedValue(new DOMException("Denied", "NotAllowedError")),
      },
    });

    const result = await readImageFromClipboard();
    expect(result).toEqual({ ok: false, reason: "denied" });
  });

  it("returns no-image when clipboard has no image types", async () => {
    vi.stubGlobal("window", { isSecureContext: true });
    vi.stubGlobal("navigator", {
      clipboard: {
        read: vi.fn().mockResolvedValue([
          {
            types: ["text/plain"],
            getType: vi.fn(),
          },
        ]),
      },
    });

    const result = await readImageFromClipboard();
    expect(result).toEqual({ ok: false, reason: "no-image" });
  });

  it("returns a File when clipboard contains an image", async () => {
    const blob = new Blob(["png"], { type: "image/png" });
    vi.stubGlobal("window", { isSecureContext: true });
    vi.stubGlobal("navigator", {
      clipboard: {
        read: vi.fn().mockResolvedValue([
          {
            types: ["image/png"],
            getType: vi.fn().mockResolvedValue(blob),
          },
        ]),
      },
    });

    const result = await readImageFromClipboard();
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.file).toBeInstanceOf(File);
      expect(result.file.type).toBe("image/png");
      expect(result.file.name).toMatch(/^clipboard-\d+\.png$/);
    }
  });
});
