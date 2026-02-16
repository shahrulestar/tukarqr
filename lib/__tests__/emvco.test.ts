import { describe, it, expect } from "vitest";
import {
  parseEmvCoTlv,
  isDuitNowQr,
  parseEmvCoMerchantName,
  parseEmvCoBankName,
  parseEmvCoAmount,
} from "../emvco";

describe("parseEmvCoTlv", () => {
  it("parses simple TLV structure", () => {
    const result = parseEmvCoTlv("000402025802MY");
    expect(result.get("00")).toBe("0202");
    expect(result.get("58")).toBe("MY");
  });

  it("parses multiple tags", () => {
    const result = parseEmvCoTlv("000402025802MY5904Test");
    expect(result.get("00")).toBe("0202");
    expect(result.get("58")).toBe("MY");
    expect(result.get("59")).toBe("Test");
  });

  it("returns empty map for too short payload", () => {
    const result = parseEmvCoTlv("00");
    expect(result.size).toBe(0);
  });

  it("handles empty payload", () => {
    const result = parseEmvCoTlv("");
    expect(result.size).toBe(0);
  });
});

describe("isDuitNowQr", () => {
  it("rejects empty string", () => {
    const result = isDuitNowQr("");
    expect(result.valid).toBe(false);
    expect(result.reason).toContain("Format DuitNow QR tidak sah");
  });

  it("rejects non-string input", () => {
    const result = isDuitNowQr(null as unknown as string);
    expect(result.valid).toBe(false);
  });

  it("rejects payload with non-ASCII", () => {
    const result = isDuitNowQr("00040202\x00\x01");
    expect(result.valid).toBe(false);
    expect(result.reason).toContain("Format DuitNow QR tidak sah");
  });

  it("rejects wrong format indicator", () => {
    const result = isDuitNowQr("000401015802MY");
    expect(result.valid).toBe(false);
    expect(result.reason).toContain("bukan DuitNow QR pembayaran");
  });

  it("rejects wrong country code", () => {
    const payload = "000402025802SG";
    expect(parseEmvCoTlv(payload).get("58")).toBe("SG");
    const result = isDuitNowQr(payload);
    expect(result.valid).toBe(false);
    expect(result.reason).toContain("bukan DuitNow QR pembayaran");
  });
});

describe("parseEmvCoMerchantName", () => {
  it("extracts merchant name from tag 59", () => {
    const payload = "000402025802MY5908Merchant";
    expect(parseEmvCoMerchantName(payload)).toBe("Merchant");
  });

  it("returns null when tag 59 missing", () => {
    const payload = "000402025802MY";
    expect(parseEmvCoMerchantName(payload)).toBeNull();
  });

  it("trims whitespace", () => {
    const payload = "000402025802MY5906  Foo  ";
    expect(parseEmvCoMerchantName(payload)).toBe("Foo");
  });
});

describe("parseEmvCoBankName", () => {
  it("parses tag 26 with merchant account", () => {
    const payload = "000402025802MY26180015A0000006150001";
    const tlv = parseEmvCoTlv(payload);
    expect(tlv.get("26")).toBe("0015A0000006150001");
  });

  it("returns null when tag 26 missing", () => {
    const payload = "000402025802MY";
    expect(parseEmvCoBankName(payload)).toBeNull();
  });
});

describe("parseEmvCoAmount", () => {
  it("parses simple amount", () => {
    const payload = "000402025802MY540510.00";
    expect(parseEmvCoAmount(payload)).toBe("RM 10.00");
  });

  it("parses amount with currency code", () => {
    const payload = "000402025802MY5408458100.50";
    expect(parseEmvCoAmount(payload)).toBe("RM 100.50");
  });

  it("returns null when tag 54 missing", () => {
    const payload = "000402025802MY";
    expect(parseEmvCoAmount(payload)).toBeNull();
  });

  it("returns null for invalid amount", () => {
    const payload = "000402025802MY5405abcde";
    expect(parseEmvCoAmount(payload)).toBeNull();
  });
});
