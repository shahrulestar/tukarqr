import { decodeQrFromRgba } from "@tukarqr/qr-core";
import { decode as decodeJpeg } from "jpeg-js";
import { PNG } from "pngjs";

function stripDataUrl(input: string): { base64: string; mime?: string } {
  const match = input.match(/^data:([^;]+);base64,(.+)$/s);
  if (match) return { mime: match[1], base64: match[2] ?? "" };
  return { base64: input };
}

function base64ToBytes(base64: string): Uint8Array {
  const binary = atob(base64.replace(/\s/g, ""));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function decodeRaster(
  bytes: Uint8Array,
  mimeType?: string
): { data: Uint8ClampedArray; width: number; height: number } {
  const isJpeg =
    mimeType?.includes("jpeg") ||
    mimeType?.includes("jpg") ||
    bytes[0] === 0xff;
  if (isJpeg) {
    const decoded = decodeJpeg(bytes, { useTArray: true });
    return {
      data: new Uint8ClampedArray(decoded.data),
      width: decoded.width,
      height: decoded.height,
    };
  }
  const png = PNG.sync.read(Buffer.from(bytes));
  return {
    data: new Uint8ClampedArray(png.data),
    width: png.width,
    height: png.height,
  };
}

export function decodeQrImage(input: {
  imageBase64: string;
  mimeType?: string;
  name?: string;
}): { ok: boolean; payload?: string; error?: string; name?: string } {
  try {
    const stripped = stripDataUrl(input.imageBase64);
    const bytes = base64ToBytes(stripped.base64);
    const raster = decodeRaster(bytes, input.mimeType ?? stripped.mime);
    const payload = decodeQrFromRgba(raster.data, raster.width, raster.height);
    if (!payload) {
      return { ok: false, error: "No QR code found", name: input.name };
    }
    return { ok: true, payload, name: input.name };
  } catch {
    return {
      ok: false,
      error: "Could not decode image (PNG/JPEG only; HEIC is not supported)",
      name: input.name,
    };
  }
}

export function decodeQrImagesBulk(
  images: Array<{ imageBase64: string; mimeType?: string; name?: string }>
) {
  const limited = images.slice(0, 10);
  return {
    count: limited.length,
    truncated: images.length > 10,
    results: limited.map((image, index) =>
      decodeQrImage({ ...image, name: image.name ?? `image-${index + 1}` })
    ),
  };
}
