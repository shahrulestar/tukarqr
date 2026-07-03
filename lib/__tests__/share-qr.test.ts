import { afterEach, describe, expect, it, vi } from "vitest";
import { canShareQrFiles } from "../share-qr";

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
