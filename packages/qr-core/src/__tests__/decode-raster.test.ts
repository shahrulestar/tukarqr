import QRCode from "qrcode";
import { describe, expect, it } from "vitest";
import {
  binarize,
  centerSquareCrop,
  contrastStretch,
  decodeQrFromRgba,
  type QrRaster,
} from "../decode-raster";

const PAYLOAD = "00020201021126420014A000000615000101066033460210MD001675755204866153034585802MY5925MASJID AN NUR KG PULAU PA6002MY62730325176058824920300364503190705201760588252660003807507161760587771148005630470BF";

function paintQr(payload: string, modulePx = 6): QrRaster {
  const qr = QRCode.create(payload, { errorCorrectionLevel: "M" });
  const modules = qr.modules.size;
  const quiet = 4;
  const size = (modules + quiet * 2) * modulePx;
  const data = new Uint8ClampedArray(size * size * 4);
  data.fill(255);
  for (let row = 0; row < modules; row++) {
    for (let col = 0; col < modules; col++) {
      if (!qr.modules.data[row * modules + col]) continue;
      for (let y = 0; y < modulePx; y++) {
        for (let x = 0; x < modulePx; x++) {
          const px =
            (quiet * modulePx + row * modulePx + y) * size +
            (quiet * modulePx + col * modulePx + x);
          const i = px * 4;
          data[i] = data[i + 1] = data[i + 2] = 0;
          data[i + 3] = 255;
        }
      }
    }
  }
  return { data, width: size, height: size };
}

function flattenContrast(raster: QrRaster): QrRaster {
  const data = new Uint8ClampedArray(raster.data);
  for (let i = 0; i < data.length; i += 4) {
    const dark = data[i] < 128;
    const value = dark ? 110 : 145;
    data[i] = data[i + 1] = data[i + 2] = value;
  }
  return { data, width: raster.width, height: raster.height };
}

describe("raster helpers", () => {
  it("center-crops a wide image", () => {
    const data = new Uint8ClampedArray(100 * 40 * 4);
    const cropped = centerSquareCrop({ data, width: 100, height: 40 });
    expect(cropped.width).toBe(40);
    expect(cropped.height).toBe(40);
  });

  it("binarizes around the threshold", () => {
    const data = new Uint8ClampedArray([200, 200, 200, 255, 40, 40, 40, 255]);
    const out = binarize({ data, width: 2, height: 1 }, 128);
    expect(out.data[0]).toBe(255);
    expect(out.data[4]).toBe(0);
  });

  it("stretches a narrow contrast range to full black and white", () => {
    const data = new Uint8ClampedArray([110, 110, 110, 255, 145, 145, 145, 255]);
    const out = contrastStretch({ data, width: 2, height: 1 });
    expect(out.data[0]).toBe(0);
    expect(out.data[4]).toBe(255);
  });
});

describe("decodeQrFromRgba", () => {
  it("decodes a crisp QR", () => {
    const raster = paintQr(PAYLOAD);
    expect(decodeQrFromRgba(raster.data, raster.width, raster.height)).toBe(PAYLOAD);
  });

  it("decodes a low-contrast QR", () => {
    const raster = flattenContrast(paintQr(PAYLOAD));
    expect(decodeQrFromRgba(raster.data, raster.width, raster.height)).toBe(PAYLOAD);
  });

  it("decodes a QR centered in a wide photo", () => {
    const qr = paintQr(PAYLOAD, 4);
    const width = qr.width + 180;
    const height = qr.height + 40;
    const data = new Uint8ClampedArray(width * height * 4);
    data.fill(255);
    const ox = Math.floor((width - qr.width) / 2);
    const oy = Math.floor((height - qr.height) / 2);
    for (let y = 0; y < qr.height; y++) {
      const src = y * qr.width * 4;
      const dst = ((oy + y) * width + ox) * 4;
      data.set(qr.data.subarray(src, src + qr.width * 4), dst);
    }
    expect(decodeQrFromRgba(data, width, height)).toBe(PAYLOAD);
  });
});
