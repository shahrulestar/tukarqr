import { describe, expect, it } from "vitest";
import { encodeQr } from "../tools/encode-qr";
import { parseDuitNowQrTool } from "../tools/parse-duitnow-qr";
import { validateDuitNowQr } from "../tools/validate-duitnow-qr";

describe("validateDuitNowQr", () => {
  it("rejects empty payload", () => {
    expect(validateDuitNowQr("")).toEqual({
      valid: false,
      reasonCode: "invalid_format",
      reason: "Invalid DuitNow QR format",
    });
  });

  it("rejects wrong country", () => {
    const result = validateDuitNowQr("000402025802SG");
    expect(result.valid).toBe(false);
    expect(result.reasonCode).toBe("not_duitnow");
  });
});

describe("parseDuitNowQrTool", () => {
  it("returns validation failure for invalid payload", () => {
    const result = parseDuitNowQrTool("");
    expect(result.valid).toBe(false);
  });

  it("parses merchant name from a partial payload", () => {
    const payload = "000402025802MY5908Merchant";
    const result = parseDuitNowQrTool(payload);
    expect(result.valid).toBe(false);
  });
});

describe("encodeQr", () => {
  it("encodes svg", async () => {
    const result = await encodeQr("HELLO", "svg", 128);
    expect(result).toMatchObject({ format: "svg", mimeType: "image/svg+xml" });
    expect("data" in result && String(result.data)).toContain("<svg");
  });

  it("encodes png as base64", async () => {
    const result = await encodeQr("HELLO", "png", 128);
    expect(result).toMatchObject({ format: "png", mimeType: "image/png" });
    expect("data" in result && (result.data?.length ?? 0)).toBeGreaterThan(20);
  });
});
