import { describe, expect, it } from "vitest";
import { getDuitNowQrDetailsTool } from "../tools/details";
import { encodeQr } from "../tools/encode-qr";
import { encodeQrBulk } from "../tools/encode-qr-bulk";
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
});

describe("getDuitNowQrDetailsTool", () => {
  it("returns TLV keys for a payload", () => {
    const details = getDuitNowQrDetailsTool("000402025802MY5908Merchant");
    expect(details.tlv["59"]).toBe("Merchant");
    expect(details.payload).toContain("0004");
  });
});

describe("encodeQr", () => {
  it("encodes svg with national frame", async () => {
    const result = await encodeQr({
      payload: "HELLO",
      format: "svg",
      layout: "duitnow",
      merchantName: "TEST MERCHANT",
    });
    expect(result).toMatchObject({ format: "svg", mimeType: "image/svg+xml" });
    expect("data" in result && String(result.data)).toContain("MALAYSIA NATIONAL QR");
    expect("data" in result && String(result.data)).not.toMatch(/<image/i);
  });

  it("encodes png as base64", async () => {
    const result = await encodeQr({ payload: "HELLO", format: "png" });
    expect(result).toMatchObject({ format: "png", mimeType: "image/png" });
    expect("data" in result && (result.data?.length ?? 0)).toBeGreaterThan(20);
  });
});

describe("encodeQrBulk", () => {
  it("zips two pngs", async () => {
    const result = await encodeQrBulk({
      items: [{ payload: "ONE", name: "one.png" }, { payload: "TWO", name: "two.png" }],
      layout: "plain",
    });
    expect(result.format).toBe("zip");
    expect(result.count).toBe(2);
    expect(result.data.length).toBeGreaterThan(20);
  });
});
