import jsQR from "jsqr";

/** Yield to main thread so the browser can paint, handle events, and run animations */
function yieldToMain(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

/** Yield every N attempts to keep the UI responsive without excessive overhead */
const YIELD_EVERY = 3;

function decodeQrFromCanvas(canvas: HTMLCanvasElement): string | null {
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const result = jsQR(imageData.data, canvas.width, canvas.height, {
    inversionAttempts: "attemptBoth",
  });

  return result?.data || null;
}

let zxingModule: Awaited<typeof import("@zxing/browser")> | null = null;

async function getZxingReader() {
  if (!zxingModule) {
    zxingModule = await import("@zxing/browser");
  }
  return new zxingModule.BrowserQRCodeReader();
}

async function decodeWithZxing(
  canvas: HTMLCanvasElement
): Promise<string | null> {
  try {
    const reader = await getZxingReader();
    const result = await Promise.resolve(reader.decodeFromCanvas(canvas));
    return result?.getText() || null;
  } catch {
    return null;
  }
}

async function tryDecode(canvas: HTMLCanvasElement): Promise<string | null> {
  const jsQrResult = decodeQrFromCanvas(canvas);
  if (jsQrResult) return jsQrResult;
  const zxingResult = await decodeWithZxing(canvas);
  if (zxingResult) return zxingResult;
  return null;
}

/** Reusable temp canvas to avoid GC pressure from creating many canvases */
let _tempCanvas: HTMLCanvasElement | null = null;

function getTempCanvas(w: number, h: number): {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
} | null {
  if (!_tempCanvas) _tempCanvas = document.createElement("canvas");
  _tempCanvas.width = w;
  _tempCanvas.height = h;
  const ctx = _tempCanvas.getContext("2d");
  if (!ctx) return null;
  return { canvas: _tempCanvas, ctx };
}

function tryDecodeAtScale(
  sourceCanvas: HTMLCanvasElement,
  scale: number,
  filter?: string
): Promise<string | null> {
  const w = Math.max(1, Math.round(sourceCanvas.width * scale));
  const h = Math.max(1, Math.round(sourceCanvas.height * scale));

  const temp = getTempCanvas(w, h);
  if (!temp) return Promise.resolve(null);
  const { canvas, ctx } = temp;

  if (filter) ctx.filter = filter;
  ctx.drawImage(
    sourceCanvas,
    0,
    0,
    sourceCanvas.width,
    sourceCanvas.height,
    0,
    0,
    w,
    h
  );
  ctx.filter = "none";

  return tryDecode(canvas);
}

function centerSquareCrop(
  sourceCanvas: HTMLCanvasElement
): HTMLCanvasElement {
  const w = sourceCanvas.width;
  const h = sourceCanvas.height;
  const size = Math.min(w, h);
  if (size <= 0) return sourceCanvas;

  const sx = Math.floor((w - size) / 2);
  const sy = Math.floor((h - size) / 2);

  const crop = document.createElement("canvas");
  crop.width = size;
  crop.height = size;
  const ctx = crop.getContext("2d");
  if (!ctx) return sourceCanvas;

  ctx.drawImage(sourceCanvas, sx, sy, size, size, 0, 0, size, size);
  return crop;
}

function applyContrastStretch(
  sourceCanvas: HTMLCanvasElement
): HTMLCanvasElement {
  const ctx = sourceCanvas.getContext("2d");
  if (!ctx) return sourceCanvas;

  const imageData = ctx.getImageData(
    0,
    0,
    sourceCanvas.width,
    sourceCanvas.height
  );
  const data = imageData.data;
  let min = 255;
  let max = 0;

  for (let i = 0; i < data.length; i += 4) {
    const luminance =
      0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    if (luminance < min) min = luminance;
    if (luminance > max) max = luminance;
  }

  const range = max - min || 1;
  for (let i = 0; i < data.length; i += 4) {
    const luminance =
      0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    const stretched = ((luminance - min) / range) * 255;
    data[i] = data[i + 1] = data[i + 2] = Math.round(stretched);
  }

  const out = document.createElement("canvas");
  out.width = sourceCanvas.width;
  out.height = sourceCanvas.height;
  const outCtx = out.getContext("2d");
  if (!outCtx) return sourceCanvas;
  outCtx.putImageData(imageData, 0, 0);
  return out;
}

function applyBinarize(
  sourceCanvas: HTMLCanvasElement,
  threshold = 128
): HTMLCanvasElement {
  const ctx = sourceCanvas.getContext("2d");
  if (!ctx) return sourceCanvas;

  const imageData = ctx.getImageData(
    0,
    0,
    sourceCanvas.width,
    sourceCanvas.height
  );
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const luminance =
      0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    const v = luminance >= threshold ? 255 : 0;
    data[i] = data[i + 1] = data[i + 2] = v;
  }

  const out = document.createElement("canvas");
  out.width = sourceCanvas.width;
  out.height = sourceCanvas.height;
  const outCtx = out.getContext("2d");
  if (!outCtx) return sourceCanvas;
  outCtx.putImageData(imageData, 0, 0);
  return out;
}

export async function preprocessAndDecode(
  sourceCanvas: HTMLCanvasElement,
  options?: { full?: boolean; signal?: AbortSignal }
): Promise<string | null> {
  const full = options?.full ?? true;
  const signal = options?.signal;
  const w = sourceCanvas.width;
  const h = sourceCanvas.height;
  const aspectRatio = w / h;
  const isNonSquare = aspectRatio > 1.2 || aspectRatio < 0.8;

  const baseScales = [1, 0.5, 0.2, 2, 3, 4];
  const portraitScales =
    aspectRatio < 0.9 ? [0.75, 1.33, 1.5] : [];
  const landscapeScales =
    aspectRatio > 1.1 ? [0.75, 1.33] : [];
  const scales = [...new Set([...baseScales, ...portraitScales, ...landscapeScales])];
  const styledFilters = ["grayscale(1)", "contrast(1.3)", "contrast(1.5) brightness(0.95)"];

  let attemptCount = 0;

  async function maybeYield() {
    attemptCount++;
    if (attemptCount % YIELD_EVERY === 0) await yieldToMain();
  }

  if (isNonSquare) {
    const cropped = centerSquareCrop(sourceCanvas);
    for (const scale of scales) {
      if (signal?.aborted) return null;
      const result = await tryDecodeAtScale(cropped, scale);
      if (result) return result;
      await maybeYield();
    }
    for (const filter of styledFilters) {
      for (const scale of scales) {
        if (signal?.aborted) return null;
        const result = await tryDecodeAtScale(cropped, scale, filter);
        if (result) return result;
        await maybeYield();
      }
    }
  }

  for (const scale of scales) {
    if (signal?.aborted) return null;
    const result = await tryDecodeAtScale(sourceCanvas, scale);
    if (result) return result;
    await maybeYield();
  }

  for (const filter of styledFilters) {
    for (const scale of scales) {
      if (signal?.aborted) return null;
      const result = await tryDecodeAtScale(sourceCanvas, scale, filter);
      if (result) return result;
      await maybeYield();
    }
  }

  if (!full) {
    for (const scale of [0.2, 0.5]) {
      if (signal?.aborted) return null;
      const result = await tryDecodeAtScale(
        sourceCanvas,
        scale,
        "blur(0.5px)"
      );
      if (result) return result;
      await maybeYield();
    }
    return null;
  }

  for (const scale of scales) {
    if (signal?.aborted) return null;
    const result = await tryDecodeAtScale(
      sourceCanvas,
      scale,
      "blur(0.5px)"
    );
    if (result) return result;
    await maybeYield();
  }

  for (const scale of scales) {
    if (signal?.aborted) return null;
    const scaleW = Math.max(1, Math.round(sourceCanvas.width * scale));
    const scaleH = Math.max(1, Math.round(sourceCanvas.height * scale));
    const stretchCanvas = document.createElement("canvas");
    stretchCanvas.width = scaleW;
    stretchCanvas.height = scaleH;
    const ctx = stretchCanvas.getContext("2d");
    if (!ctx) continue;
    ctx.drawImage(
      sourceCanvas,
      0,
      0,
      sourceCanvas.width,
      sourceCanvas.height,
      0,
      0,
      scaleW,
      scaleH
    );
    await yieldToMain();
    const stretched = applyContrastStretch(stretchCanvas);
    const result = await tryDecode(stretched);
    if (result) return result;
    await maybeYield();
  }

  for (const scale of [1, 2, 3]) {
    if (signal?.aborted) return null;
    const scaleW = Math.max(1, Math.round(sourceCanvas.width * scale));
    const scaleH = Math.max(1, Math.round(sourceCanvas.height * scale));
    const binCanvas = document.createElement("canvas");
    binCanvas.width = scaleW;
    binCanvas.height = scaleH;
    const ctx = binCanvas.getContext("2d");
    if (!ctx) continue;
    ctx.drawImage(
      sourceCanvas,
      0,
      0,
      sourceCanvas.width,
      sourceCanvas.height,
      0,
      0,
      scaleW,
      scaleH
    );
    await yieldToMain();
    const stretched = applyContrastStretch(binCanvas);
    for (const threshold of [100, 128, 150]) {
      const binarized = applyBinarize(stretched, threshold);
      const result = await tryDecode(binarized);
      if (result) return result;
      await maybeYield();
    }
  }

  for (const scale of scales) {
    if (signal?.aborted) return null;
    const scaleW = Math.max(1, Math.round(sourceCanvas.width * scale));
    const scaleH = Math.max(1, Math.round(sourceCanvas.height * scale));
    const grayCanvas = document.createElement("canvas");
    grayCanvas.width = scaleW;
    grayCanvas.height = scaleH;
    const ctx = grayCanvas.getContext("2d");
    if (!ctx) continue;
    ctx.filter = "grayscale(1)";
    ctx.drawImage(
      sourceCanvas,
      0,
      0,
      sourceCanvas.width,
      sourceCanvas.height,
      0,
      0,
      scaleW,
      scaleH
    );
    ctx.filter = "none";
    await yieldToMain();
    const stretched = applyContrastStretch(grayCanvas);
    const result = await tryDecode(stretched);
    if (result) return result;
    await maybeYield();
  }

  return null;
}
