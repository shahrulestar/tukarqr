import { describe, expect, it } from "vitest";
import { buildExportSvg } from "../export-frame";
import { getDuitNowQrDetails } from "../details";
import { NATIONAL_QR_LABEL, PRIMARY_MAGENTA, SYSTEM_FONT_STACK } from "../export-types";

const SAMPLE = "HELLO-TUKARQR";

describe("buildExportSvg", () => {
  it("includes Malaysia National QR bar and no logo images", () => {
    const { svg, width, height } = buildExportSvg(SAMPLE, {
      layout: "duitnow",
      merchantName: "MASJID AN NUR KG PULAU PA",
      bankName: "Bank Islam Malaysia Berhad",
    });
    expect(svg).toContain(NATIONAL_QR_LABEL);
    expect(svg).toContain(PRIMARY_MAGENTA);
    expect(PRIMARY_MAGENTA).toBe("#ec4899");
    expect(svg).toContain(SYSTEM_FONT_STACK);
    expect(svg).toContain("MASJID AN NUR KG PULAU PA");
    expect(svg).toContain("Bank Islam Malaysia Berhad");
    expect(svg).not.toMatch(/<image/i);
    expect(svg.toLowerCase()).not.toContain("duitnow");
    expect(width).toBe(1000);
    expect(height).toBe(1000);
  });

  it("uses 3:4 canvas when requested", () => {
    const { width, height } = buildExportSvg(SAMPLE, {
      layout: "duitnow",
      ratio: "3:4",
    });
    expect(width).toBe(900);
    expect(height).toBe(1200);
  });

  it("plain layout omits national label", () => {
    const { svg, width } = buildExportSvg(SAMPLE, { layout: "plain" });
    expect(svg).not.toContain(NATIONAL_QR_LABEL);
    expect(width).toBe(1000);
  });
});

describe("getDuitNowQrDetails", () => {
  it("returns tlv map for a simple payload", () => {
    const details = getDuitNowQrDetails("000402025802MY5908Merchant");
    expect(details.tlv["00"]).toBe("0202");
    expect(details.tlv["58"]).toBe("MY");
    expect(details.summary.merchantName).toBe("Merchant");
    expect(details.valid).toBe(false);
    expect(details.payloadLength).toBeGreaterThan(0);
  });
});
