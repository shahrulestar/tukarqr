import jsQR from "jsqr";

function decodeQrFromCanvas(canvas: HTMLCanvasElement): string | null {
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const result = jsQR(imageData.data, canvas.width, canvas.height, {
    inversionAttempts: "attemptBoth",
  });

  return result?.data || null;
}

async function decodeWithZxing(
  canvas: HTMLCanvasElement
): Promise<string | null> {
  try {
    const { BrowserQRCodeReader } = await import("@zxing/browser");
    const reader = new BrowserQRCodeReader();
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

function tryDecodeAtScale(
  sourceCanvas: HTMLCanvasElement,
  scale: number,
  filter?: string
): Promise<string | null> {
  const w = Math.max(1, Math.round(sourceCanvas.width * scale));
  const h = Math.max(1, Math.round(sourceCanvas.height * scale));
  const temp = document.createElement("canvas");
  temp.width = w;
  temp.height = h;
  const ctx = temp.getContext("2d");
  if (!ctx) return Promise.resolve(null);

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

  return tryDecode(temp);
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

  const temp = document.createElement("canvas");
  temp.width = size;
  temp.height = size;
  const ctx = temp.getContext("2d");
  if (!ctx) return sourceCanvas;

  ctx.drawImage(sourceCanvas, sx, sy, size, size, 0, 0, size, size);
  return temp;
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
    min = Math.min(min, luminance);
    max = Math.max(max, luminance);
  }

  const range = max - min || 1;
  for (let i = 0; i < data.length; i += 4) {
    const luminance =
      0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    const stretched = ((luminance - min) / range) * 255;
    data[i] = data[i + 1] = data[i + 2] = Math.round(stretched);
  }

  const temp = document.createElement("canvas");
  temp.width = sourceCanvas.width;
  temp.height = sourceCanvas.height;
  const tempCtx = temp.getContext("2d");
  if (!tempCtx) return sourceCanvas;
  tempCtx.putImageData(imageData, 0, 0);
  return temp;
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

  const temp = document.createElement("canvas");
  temp.width = sourceCanvas.width;
  temp.height = sourceCanvas.height;
  const tempCtx = temp.getContext("2d");
  if (!tempCtx) return sourceCanvas;
  tempCtx.putImageData(imageData, 0, 0);
  return temp;
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

  if (isNonSquare) {
    const cropped = centerSquareCrop(sourceCanvas);
    for (const scale of scales) {
      if (signal?.aborted) return null;
      const result = await tryDecodeAtScale(cropped, scale);
      if (result) return result;
    }
    for (const filter of styledFilters) {
      for (const scale of scales) {
        if (signal?.aborted) return null;
        const result = await tryDecodeAtScale(cropped, scale, filter);
        if (result) return result;
      }
    }
  }

  for (const scale of scales) {
    if (signal?.aborted) return null;
    const result = await tryDecodeAtScale(sourceCanvas, scale);
    if (result) return result;
  }

  for (const filter of styledFilters) {
    for (const scale of scales) {
      if (signal?.aborted) return null;
      const result = await tryDecodeAtScale(sourceCanvas, scale, filter);
      if (result) return result;
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
  }

  for (const scale of scales) {
    if (signal?.aborted) return null;
    const temp = document.createElement("canvas");
    temp.width = Math.max(1, Math.round(sourceCanvas.width * scale));
    temp.height = Math.max(1, Math.round(sourceCanvas.height * scale));
    const ctx = temp.getContext("2d");
    if (!ctx) continue;
    ctx.drawImage(
      sourceCanvas,
      0,
      0,
      sourceCanvas.width,
      sourceCanvas.height,
      0,
      0,
      temp.width,
      temp.height
    );
    const stretched = applyContrastStretch(temp);
    const result = await tryDecode(stretched);
    if (result) return result;
  }

  for (const scale of [1, 2, 3]) {
    if (signal?.aborted) return null;
    const temp = document.createElement("canvas");
    temp.width = Math.max(1, Math.round(sourceCanvas.width * scale));
    temp.height = Math.max(1, Math.round(sourceCanvas.height * scale));
    const ctx = temp.getContext("2d");
    if (!ctx) continue;
    ctx.drawImage(
      sourceCanvas,
      0,
      0,
      sourceCanvas.width,
      sourceCanvas.height,
      0,
      0,
      temp.width,
      temp.height
    );
    const stretched = applyContrastStretch(temp);
    for (const threshold of [100, 128, 150]) {
      const binarized = applyBinarize(stretched, threshold);
      const result = await tryDecode(binarized);
      if (result) return result;
    }
  }

  for (const scale of scales) {
    if (signal?.aborted) return null;
    const temp = document.createElement("canvas");
    temp.width = Math.max(1, Math.round(sourceCanvas.width * scale));
    temp.height = Math.max(1, Math.round(sourceCanvas.height * scale));
    const ctx = temp.getContext("2d");
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
      temp.width,
      temp.height
    );
    ctx.filter = "none";
    const stretched = applyContrastStretch(temp);
    const result = await tryDecode(stretched);
    if (result) return result;
  }

  return null;
}
