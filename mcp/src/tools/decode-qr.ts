import jsQR from "jsqr";
import { decode as decodeJpeg } from "jpeg-js";
import { PNG } from "pngjs";

const MAX_DIM = 2000;

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

function downscale(
  data: Uint8ClampedArray,
  width: number,
  height: number
): { data: Uint8ClampedArray; width: number; height: number } {
  const max = Math.max(width, height);
  if (max <= MAX_DIM) return { data, width, height };
  const scale = MAX_DIM / max;
  const w = Math.max(1, Math.round(width * scale));
  const h = Math.max(1, Math.round(height * scale));
  const out = new Uint8ClampedArray(w * h * 4);
  for (let y = 0; y < h; y++) {
    const sy = Math.min(height - 1, Math.floor(y / scale));
    for (let x = 0; x < w; x++) {
      const sx = Math.min(width - 1, Math.floor(x / scale));
      const si = (sy * width + sx) * 4;
      const di = (y * w + x) * 4;
      out[di] = data[si] ?? 0;
      out[di + 1] = data[si + 1] ?? 0;
      out[di + 2] = data[si + 2] ?? 0;
      out[di + 3] = data[si + 3] ?? 255;
    }
  }
  return { data: out, width: w, height: h };
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
    const scaled = downscale(raster.data, raster.width, raster.height);
    const result = jsQR(scaled.data, scaled.width, scaled.height, {
      inversionAttempts: "attemptBoth",
    });
    if (!result?.data) {
      return { ok: false, error: "No QR code found", name: input.name };
    }
    return { ok: true, payload: result.data, name: input.name };
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
