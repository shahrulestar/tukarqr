import { afterEach, describe, expect, it, vi } from "vitest";
import {
  canShareQrFiles,
  dataUrlToFile,
  exportPngDataUrl,
  isAndroidDevice,
  isIosDevice,
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

describe("canShareQrFiles", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns false when navigator.canShare is unavailable", () => {
    vi.stubGlobal("navigator", { share: vi.fn() });
    expect(canShareQrFiles()).toBe(false);
  });

  it("returns true when navigator.canShare accepts image files", () => {
    vi.stubGlobal("navigator", {
      canShare: vi.fn().mockReturnValue(true),
      share: vi.fn(),
    });
    expect(canShareQrFiles()).toBe(true);
  });

  it("returns false when navigator.canShare rejects image files", () => {
    vi.stubGlobal("navigator", {
      canShare: vi.fn().mockReturnValue(false),
      share: vi.fn(),
    });
    expect(canShareQrFiles()).toBe(false);
  });
});

describe("device helpers", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("detects iPad (MacIntel + touch)", () => {
    stubNavigator({
      share: vi.fn(),
      maxTouchPoints: 5,
      userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
      platform: "MacIntel",
    });
    stubMatchMedia(true);

    expect(isIosDevice()).toBe(true);
  });

  it("detects Android", () => {
    stubNavigator({
      share: vi.fn(),
      maxTouchPoints: 5,
      userAgent: "Mozilla/5.0 (Linux; Android 14; Pixel 8)",
      platform: "Linux armv8l",
    });
    stubMatchMedia(true);

    expect(isAndroidDevice()).toBe(true);
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

  function stubDownloadDom() {
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
    return clickSpy;
  }

  it("downloads via anchor on desktop", async () => {
    stubNavigator({ maxTouchPoints: 0, userAgent: "Chrome" });
    stubMatchMedia(false);
    const clickSpy = stubDownloadDom();

    const dataUrl =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
    const result = await exportPngDataUrl(dataUrl, "qr.png");

    expect(result).toBe("downloaded");
    expect(clickSpy).toHaveBeenCalled();
  });

  it("downloads via anchor on mobile even when native share is available", async () => {
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
    const clickSpy = stubDownloadDom();

    const dataUrl =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
    const result = await exportPngDataUrl(dataUrl, "qr.png");

    expect(result).toBe("downloaded");
    expect(clickSpy).toHaveBeenCalled();
    expect(shareMock).not.toHaveBeenCalled();
  });
});
