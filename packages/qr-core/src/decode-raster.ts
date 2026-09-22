import {
  BinaryBitmap,
  DecodeHintType,
  HybridBinarizer,
  QRCodeReader,
  RGBLuminanceSource,
} from "@zxing/library";
import jsQR from "jsqr";

export interface QrRaster {
  data: Uint8ClampedArray;
  width: number;
  height: number;
}

const MAX_DIM = 1600;
const BASE_SCALES = [1, 0.5, 0.2, 2, 3, 4];

const reader = new QRCodeReader();
const hints = new Map<DecodeHintType, boolean>();
hints.set(DecodeHintType.TRY_HARDER, true);

function limitDimension(raster: QrRaster): QrRaster {
  const max = Math.max(raster.width, raster.height);
  if (max <= MAX_DIM) return raster;
  return scaleRaster(raster, MAX_DIM / max) ?? raster;
}

export function centerSquareCrop(raster: QrRaster): QrRaster {
  const { data, width, height } = raster;
  const size = Math.min(width, height);
  if (size <= 0 || (size === width && size === height)) return raster;
  const sx = Math.floor((width - size) / 2);
  const sy = Math.floor((height - size) / 2);
  const out = new Uint8ClampedArray(size * size * 4);
  for (let y = 0; y < size; y++) {
    const src = ((sy + y) * width + sx) * 4;
    out.set(data.subarray(src, src + size * 4), y * size * 4);
  }
  return { data: out, width: size, height: size };
}

export function contrastStretch(raster: QrRaster): QrRaster {
  const data = new Uint8ClampedArray(raster.data);
  let min = 255;
  let max = 0;
  for (let i = 0; i < data.length; i += 4) {
    const luminance = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    if (luminance < min) min = luminance;
    if (luminance > max) max = luminance;
  }
  const range = max - min || 1;
  for (let i = 0; i < data.length; i += 4) {
    const luminance = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    const stretched = ((luminance - min) / range) * 255;
    data[i] = data[i + 1] = data[i + 2] = Math.round(stretched);
    data[i + 3] = 255;
  }
  return { data, width: raster.width, height: raster.height };
}

export function binarize(raster: QrRaster, threshold = 128): QrRaster {
  const data = new Uint8ClampedArray(raster.data);
  for (let i = 0; i < data.length; i += 4) {
    const luminance = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    const value = luminance >= threshold ? 255 : 0;
    data[i] = data[i + 1] = data[i + 2] = value;
    data[i + 3] = 255;
  }
  return { data, width: raster.width, height: raster.height };
}

export function scaleRaster(raster: QrRaster, scale: number): QrRaster | null {
  if (!Number.isFinite(scale) || scale <= 0) return null;
  const width = Math.max(1, Math.round(raster.width * scale));
  const height = Math.max(1, Math.round(raster.height * scale));
  if (width < 21 || height < 21) return null;
  if (Math.max(width, height) > MAX_DIM) return null;
  if (width === raster.width && height === raster.height) return raster;

  const data = new Uint8ClampedArray(width * height * 4);
  if (scale < 1) {
    const xScale = raster.width / width;
    const yScale = raster.height / height;
    for (let y = 0; y < height; y++) {
      const y0 = Math.floor(y * yScale);
      const y1 = Math.max(y0 + 1, Math.min(raster.height, Math.floor((y + 1) * yScale)));
      for (let x = 0; x < width; x++) {
        const x0 = Math.floor(x * xScale);
        const x1 = Math.max(x0 + 1, Math.min(raster.width, Math.floor((x + 1) * xScale)));
        let r = 0;
        let g = 0;
        let b = 0;
        let a = 0;
        let count = 0;
        for (let yy = y0; yy < y1; yy++) {
          for (let xx = x0; xx < x1; xx++) {
            const i = (yy * raster.width + xx) * 4;
            r += raster.data[i] ?? 0;
            g += raster.data[i + 1] ?? 0;
            b += raster.data[i + 2] ?? 0;
            a += raster.data[i + 3] ?? 255;
            count++;
          }
        }
        const o = (y * width + x) * 4;
        data[o] = r / count;
        data[o + 1] = g / count;
        data[o + 2] = b / count;
        data[o + 3] = a / count;
      }
    }
  } else {
    for (let y = 0; y < height; y++) {
      const sy = Math.min(raster.height - 1, Math.floor(y / scale));
      for (let x = 0; x < width; x++) {
        const sx = Math.min(raster.width - 1, Math.floor(x / scale));
        const si = (sy * raster.width + sx) * 4;
        const di = (y * width + x) * 4;
        data[di] = raster.data[si] ?? 0;
        data[di + 1] = raster.data[si + 1] ?? 0;
        data[di + 2] = raster.data[si + 2] ?? 0;
        data[di + 3] = raster.data[si + 3] ?? 255;
      }
    }
  }
  return { data, width, height };
}

function scalesFor(raster: QrRaster): number[] {
  const aspect = raster.width / Math.max(1, raster.height);
  const extra = aspect < 0.9 ? [0.75, 1.33, 1.5] : aspect > 1.1 ? [0.75, 1.33] : [];
  return [...new Set([...BASE_SCALES, ...extra])];
}

function isNonSquare(raster: QrRaster): boolean {
  const aspect = raster.width / Math.max(1, raster.height);
  return aspect > 1.2 || aspect < 0.8;
}

function tryJsQr(raster: QrRaster): string | null {
  const result = jsQR(raster.data, raster.width, raster.height, {
    inversionAttempts: "attemptBoth",
  });
  return result?.data || null;
}

function tryZxing(raster: QrRaster): string | null {
  const luma = new Uint8ClampedArray(raster.width * raster.height);
  for (let i = 0, p = 0; i < raster.data.length; i += 4, p++) {
    luma[p] =
      (0.299 * raster.data[i] +
        0.587 * raster.data[i + 1] +
        0.114 * raster.data[i + 2]) |
      0;
  }
  try {
    const source = new RGBLuminanceSource(luma, raster.width, raster.height);
    try {
      return reader
        .decode(new BinaryBitmap(new HybridBinarizer(source)), hints)
        .getText();
    } catch {
      return reader
        .decode(new BinaryBitmap(new HybridBinarizer(source.invert())), hints)
        .getText();
    }
  } catch {
    return null;
  } finally {
    reader.reset();
  }
}

function forEachVariant(
  raster: QrRaster,
  decode: (raster: QrRaster) => string | null
): string | null {
  const run = (next: QrRaster | null) => (next ? decode(next) : null);

  if (isNonSquare(raster)) {
    const cropped = centerSquareCrop(raster);
    for (const scale of scalesFor(cropped)) {
      const hit = run(scale === 1 ? cropped : scaleRaster(cropped, scale));
      if (hit) return hit;
    }
  }

  for (const scale of scalesFor(raster)) {
    const hit = run(scale === 1 ? raster : scaleRaster(raster, scale));
    if (hit) return hit;
  }

  for (const scale of [1, 2]) {
    const scaled = scale === 1 ? raster : scaleRaster(raster, scale);
    if (!scaled) continue;
    const stretched = contrastStretch(scaled);
    const stretchedHit = run(stretched);
    if (stretchedHit) return stretchedHit;
    for (const threshold of [100, 128, 150]) {
      const hit = run(binarize(stretched, threshold));
      if (hit) return hit;
    }
  }

  return null;
}

export function decodeQrFromRgba(
  data: Uint8ClampedArray,
  width: number,
  height: number
): string | null {
  if (width < 21 || height < 21 || data.length < width * height * 4) return null;
  const raster = limitDimension({ data, width, height });
  return forEachVariant(raster, tryJsQr) ?? forEachVariant(raster, tryZxing);
}
