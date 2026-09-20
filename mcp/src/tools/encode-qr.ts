import QRCode from "qrcode";

export type QrEncodeFormat = "png" | "svg";

export async function encodeQr(
  payload: string,
  format: QrEncodeFormat = "png",
  size = 512
) {
  if (!payload) {
    return { error: "payload is required" };
  }

  const width = Math.min(Math.max(size, 64), 2048);

  if (format === "svg") {
    const svg = await QRCode.toString(payload, {
      type: "svg",
      width,
      margin: 2,
      errorCorrectionLevel: "M",
    });
    return {
      format: "svg" as const,
      mimeType: "image/svg+xml",
      data: svg,
    };
  }

  const dataUrl = await QRCode.toDataURL(payload, {
    type: "image/png",
    width,
    margin: 2,
    errorCorrectionLevel: "M",
  });
  const data = dataUrl.split(",")[1] ?? "";

  return {
    format: "png" as const,
    mimeType: "image/png",
    data,
  };
}
