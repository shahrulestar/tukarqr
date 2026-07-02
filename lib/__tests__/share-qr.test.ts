import { afterEach, describe, expect, it, vi } from "vitest";
import {
  dataUrlToFile,
  exportPngDataUrl,
  isAndroidDevice,
  isIosDevice,
  shouldUseNativeFileShare,
} from "../share-qr";

function stubMatchMedia(matches: boolean) {
  vi.stubGlobal("window", {
    matchMedia: (query: string) => ({
      matches,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }),
    ontouchstart: undefined,
  });
}

function stubNavigator(partial: Partial<Navigator> & { share?: Navigator["share"] }) {
  vi.stubGlobal("navigator", partial);
}

describe("shouldUseNativeFileShare", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns false when navigator.share is unavailable", () => {
    stubNavigator({ maxTouchPoints: 2, userAgent: "iPhone" });
    stubMatchMedia(true);

    expect(shouldUseNativeFileShare()).toBe(false);
  });

  it("returns false on desktop viewport even on iOS UA", () => {
    stubNavigator({
      share: vi.fn(),
      maxTouchPoints: 5,
      userAgent: "iPhone",
      platform: "iPhone",
    });
    stubMatchMedia(false);

    expect(shouldUseNativeFileShare()).toBe(false);
  });

  it("returns false on non-touch desktop Chrome", () => {
    stubNavigator({
      share: vi.fn(),
      maxTouchPoints: 0,
      userAgent: "Chrome",
      platform: "Win32",
    });
    stubMatchMedia(true);
    vi.stubGlobal("window", { ontouchstart: undefined });

    expect(shouldUseNativeFileShare()).toBe(false);
  });

  it("returns true on iPhone with touch and mobile viewport", () => {
    stubNavigator({
      share: vi.fn(),
      maxTouchPoints: 5,
      userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)",
      platform: "iPhone",
    });
    stubMatchMedia(true);

    expect(shouldUseNativeFileShare()).toBe(true);
  });

  it("returns true on iPad (MacIntel + touch)", () => {
    stubNavigator({
      share: vi.fn(),
      maxTouchPoints: 5,
      userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
      platform: "MacIntel",
    });
    stubMatchMedia(true);

    expect(isIosDevice()).toBe(true);
    expect(shouldUseNativeFileShare()).toBe(true);
  });

  it("returns true on Android with touch and mobile viewport", () => {
    stubNavigator({
      share: vi.fn(),
      maxTouchPoints: 5,
      userAgent: "Mozilla/5.0 (Linux; Android 14; Pixel 8)",
      platform: "Linux armv8l",
    });
    stubMatchMedia(true);

    expect(isAndroidDevice()).toBe(true);
    expect(shouldUseNativeFileShare()).toBe(true);
  });
});

describe("dataUrlToFile", () => {
  it("creates a PNG file from a data URL", () => {
    const dataUrl =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
    const file = dataUrlToFile(dataUrl, "test-qr.png");

    expect(file.name).toBe("test-qr.png");
    expect(file.type).toBe("image/png");
    expect(file.size).toBeGreaterThan(0);
  });
});

describe("exportPngDataUrl", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("falls back to anchor download when native share is unavailable", async () => {
    stubNavigator({ maxTouchPoints: 0, userAgent: "Chrome" });
    stubMatchMedia(false);

    const clickSpy = vi.fn();
    const appendChildSpy = vi.fn();
    const removeChildSpy = vi.fn();
    vi.stubGlobal("document", {
      createElement: () => ({
        href: "",
        download: "",
        click: clickSpy,
      }),
      body: {
        appendChild: appendChildSpy,
        removeChild: removeChildSpy,
      },
    });

    const dataUrl =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
    const result = await exportPngDataUrl(dataUrl, "qr.png");

    expect(result).toBe("downloaded");
    expect(clickSpy).toHaveBeenCalled();
  });

  it("uses native share on supported mobile device", async () => {
    const shareMock = vi.fn().mockResolvedValue(undefined);
    const canShareMock = vi.fn().mockReturnValue(true);

    stubNavigator({
      share: shareMock,
      canShare: canShareMock,
      maxTouchPoints: 5,
      userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)",
      platform: "iPhone",
    });
    stubMatchMedia(true);

    const dataUrl =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
    const result = await exportPngDataUrl(dataUrl, "qr.png");

    expect(result).toBe("shared");
    expect(shareMock).toHaveBeenCalled();
  });

  it("returns cancelled when user dismisses share sheet", async () => {
    const shareMock = vi
      .fn()
      .mockRejectedValue(new DOMException("Aborted", "AbortError"));
    const canShareMock = vi.fn().mockReturnValue(true);

    stubNavigator({
      share: shareMock,
      canShare: canShareMock,
      maxTouchPoints: 5,
      userAgent: "Mozilla/5.0 (Linux; Android 14; Pixel 8)",
      platform: "Linux armv8l",
    });
    stubMatchMedia(true);

    const dataUrl =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
    const result = await exportPngDataUrl(dataUrl, "qr.png");

    expect(result).toBe("cancelled");
  });
});
