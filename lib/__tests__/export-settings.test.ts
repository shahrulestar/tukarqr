import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  loadExportSettings,
  saveExportSettings,
} from "../export-settings";

const STORAGE_KEY = "tukarqr-export-settings";

function createLocalStorageMock() {
  const store = new Map<string, string>();
  return {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => {
      store.set(key, value);
    },
    removeItem: (key: string) => {
      store.delete(key);
    },
    clear: () => {
      store.clear();
    },
  };
}

describe("export-settings", () => {
  beforeEach(() => {
    const storage = createLocalStorageMock();
    vi.stubGlobal("window", { localStorage: storage });
    vi.stubGlobal("localStorage", storage);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns defaults when nothing is stored", () => {
    expect(loadExportSettings()).toEqual({
      exportLayout: "duitnow",
      qrStyle: "classic",
      showBankName: true,
      outerBg: "white",
      exportRatio: "1:1",
    });
  });

  it("round-trips valid settings through localStorage", () => {
    const settings = {
      exportLayout: "plain" as const,
      qrStyle: "rounded" as const,
      showBankName: false,
      outerBg: "transparent" as const,
      exportRatio: "3:4" as const,
    };

    saveExportSettings(settings);
    expect(localStorage.getItem(STORAGE_KEY)).toBeTruthy();
    expect(loadExportSettings()).toEqual(settings);
  });

  it("returns defaults when stored JSON is invalid", () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ exportLayout: "bad" }));
    expect(loadExportSettings().exportLayout).toBe("duitnow");
  });
});
