import { parseDuitNowQr } from "@tukarqr/qr-core";
import { encodeQr, type EncodeQrInput } from "./encode-qr";
import { encodeQrBulk } from "./encode-qr-bulk";
import { decodeQrImage, decodeQrImagesBulk } from "./decode-qr";
import { validateDuitNowQr } from "./validate-duitnow-qr";

type ConvertStyle = Pick<
  EncodeQrInput,
  "format" | "layout" | "qrStyle" | "outerBg" | "ratio" | "showBankName"
>;

export async function convertQrImage(
  input: ConvertStyle & {
    imageBase64: string;
    mimeType?: string;
    name?: string;
  }
) {
  const decoded = decodeQrImage(input);
  if (!decoded.ok || !decoded.payload) {
    return { ok: false as const, error: decoded.error, name: decoded.name };
  }

  const parsed = parseDuitNowQr(decoded.payload);
  if (!parsed.valid) {
    const validation = validateDuitNowQr(decoded.payload);
    return {
      ok: false as const,
      error: validation.reason ?? "Invalid DuitNow QR",
      reasonCode: parsed.reasonCode,
      payload: decoded.payload,
      name: decoded.name,
    };
  }

  const encoded = await encodeQr({
    payload: decoded.payload,
    format: input.format,
    layout: input.layout,
    qrStyle: input.qrStyle,
    outerBg: input.outerBg,
    ratio: input.ratio,
    showBankName: input.showBankName,
  });

  if ("error" in encoded && encoded.error) {
    return {
      ok: false as const,
      error: encoded.error,
      reasonCode: encoded.reasonCode,
      payload: decoded.payload,
      name: decoded.name,
    };
  }

  return {
    ok: true as const,
    name: decoded.name,
    payload: decoded.payload,
    summary: {
      merchantName: parsed.merchantName,
      bankName: parsed.bankName,
      amount: parsed.amount,
      countryCode: parsed.countryCode,
    },
    ...encoded,
  };
}

export async function convertQrImagesBulk(
  input: Omit<ConvertStyle, "format"> & {
    images: Array<{ imageBase64: string; mimeType?: string; name?: string }>;
  }
) {
  const decoded = decodeQrImagesBulk(input.images);
  const items: Array<{ payload: string; name?: string }> = [];
  for (const item of decoded.results) {
    if (item.ok && item.payload) {
      items.push({ payload: item.payload, name: item.name });
    }
  }

  if (items.length === 0) {
    return {
      ok: false as const,
      count: 0,
      truncated: decoded.truncated,
      decodeResults: decoded.results,
      error: "No QR codes decoded",
    };
  }

  const zip = await encodeQrBulk({
    items,
    layout: input.layout,
    qrStyle: input.qrStyle,
    outerBg: input.outerBg,
    ratio: input.ratio,
    showBankName: input.showBankName,
  });

  return {
    ...zip,
    ok: zip.count > 0,
    decodeTruncated: decoded.truncated,
    decodeResults: decoded.results,
  };
}
