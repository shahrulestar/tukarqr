import { describe, expect, it } from "vitest";
import { PNG } from "pngjs";
import QRCode from "qrcode";
import { getDuitNowQrDetailsTool } from "../tools/details";
import { convertQrImage } from "../tools/convert-qr";
import { encodeQr } from "../tools/encode-qr";
import { encodeQrBulk } from "../tools/encode-qr-bulk";
import { parseDuitNowQrTool } from "../tools/parse-duitnow-qr";
import { presentEncodeResult } from "../tool-result";
import { validateDuitNowQr } from "../tools/validate-duitnow-qr";

const SAMPLE =
  "00020201021126420014A000000615000101066033460210MD001675755204866153034585802MY5925MASJID AN NUR KG PULAU PA6002MY62730325176058824920300364503190705201760588252660003807507161760587771148005630470BF";

function qrPngBase64(payload: string): string {
  const qr = QRCode.create(payload, { errorCorrectionLevel: "M" });
  const modules = qr.modules.size;
  const modulePx = 6;
  const quiet = 4;
  const size = (modules + quiet * 2) * modulePx;
  const png = new PNG({ width: size, height: size });
  png.data.fill(255);
  for (let row = 0; row < modules; row++) {
    for (let col = 0; col < modules; col++) {
      if (!qr.modules.data[row * modules + col]) continue;
      for (let y = 0; y < modulePx; y++) {
        for (let x = 0; x < modulePx; x++) {
          const px =
            (quiet * modulePx + row * modulePx + y) * size +
            (quiet * modulePx + col * modulePx + x);
          const i = px * 4;
          png.data[i] = png.data[i + 1] = png.data[i + 2] = 0;
          png.data[i + 3] = 255;
        }
      }
    }
  }
  const bytes = PNG.sync.write(png);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i] ?? 0);
  return btoa(binary);
}

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
  it("rejects a payload that is not Malaysia DuitNow", async () => {
    const result = await encodeQr({ payload: "HELLO", format: "svg" });
    expect(result).toMatchObject({ reasonCode: "not_duitnow" });
    expect(result).not.toHaveProperty("data");
  });

  it("encodes svg with national frame", async () => {
    const result = await encodeQr({
      payload: SAMPLE,
      format: "svg",
      layout: "duitnow",
    });
    expect(result).toMatchObject({ format: "svg", mimeType: "image/svg+xml" });
    expect("data" in result && String(result.data)).toContain("MALAYSIA NATIONAL QR");
    expect("data" in result && String(result.data)).not.toMatch(/<image/i);
  });

  it("encodes a 3:4 portrait card", async () => {
    const result = await encodeQr({
      payload: SAMPLE,
      format: "svg",
      ratio: "3:4",
    });
    expect(result).toMatchObject({
      format: "svg",
      optionsUsed: { ratio: "3:4" },
    });
    expect("data" in result && String(result.data)).toContain('height="1200"');
  });

  it("encodes png as base64", async () => {
    const result = await encodeQr({ payload: SAMPLE, format: "png" });
    expect(result).toMatchObject({ format: "png", mimeType: "image/png" });
    expect("data" in result && (result.data?.length ?? 0)).toBeGreaterThan(20);
    expect("optionsUsed" in result && result.optionsUsed).toMatchObject({
      ratio: "1:1",
      layout: "duitnow",
      qrStyle: "classic",
      outerBg: "white",
      showBankName: true,
    });
    if ("data" in result && result.data) {
      const presented = presentEncodeResult(result);
      expect(presented.content[1]).toMatchObject({
        type: "image",
        mimeType: "image/png",
      });
      const summary = presented.content[0];
      if (summary?.type === "text") {
        expect(summary.text).not.toContain(result.data.slice(0, 80));
      } else {
        expect(summary?.type).toBe("text");
      }
    }
  });
});

describe("encodeQrBulk", () => {
  it("zips two pngs and skips invalid payloads", async () => {
    const result = await encodeQrBulk({
      items: [
        { payload: SAMPLE, name: "one.png" },
        { payload: "HELLO", name: "bad.png" },
      ],
      layout: "plain",
    });
    expect(result.format).toBe("zip");
    expect(result.count).toBe(1);
    expect(result.results.find((item) => item.name === "bad.png")?.ok).toBe(false);
    expect(result.data.length).toBeGreaterThan(20);
  });
});

describe("convertQrImage", () => {
  it("turns a PNG into a styled card that still carries the label", async () => {
    const imageBase64 = qrPngBase64(SAMPLE);
    const svg = await convertQrImage({
      imageBase64,
      format: "svg",
    });
    expect(svg.ok).toBe(true);
    expect("data" in svg && String(svg.data)).toContain("MALAYSIA NATIONAL QR");
    expect("summary" in svg && svg.summary.merchantName).toContain("MASJID AN NUR");

    const png = await convertQrImage({ imageBase64, format: "png" });
    expect(png).toMatchObject({ ok: true, format: "png", mimeType: "image/png" });
    expect("data" in png && String(png.data).startsWith("iVBORw0KGgo")).toBe(true);
    if ("data" in png && png.data) {
      const presented = presentEncodeResult(png);
      expect(presented.content.some((part) => part.type === "image")).toBe(true);
    }
  });
});
