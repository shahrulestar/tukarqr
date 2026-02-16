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
    const result = await reader.decodeFromCanvas(canvas);
    return result?.getText() || null;
  } catch {
    return null;
  }
}

async function tryDecode(canvas: HTMLCanvasElement): Promise<string | null> {
  const jsQrResult = decodeQrFromCanvas(canvas);
  if (jsQrResult) return jsQrResult;
  return decodeWithZxing(canvas);
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

export async function preprocessAndDecode(
  sourceCanvas: HTMLCanvasElement,
  options?: { full?: boolean; signal?: AbortSignal }
): Promise<string | null> {
  const full = options?.full ?? true;
  const signal = options?.signal;
  const scales = [1, 0.5, 0.2, 2];

  for (const scale of scales) {
    if (signal?.aborted) return null;
    const result = await tryDecodeAtScale(sourceCanvas, scale);
    if (result) return result;
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

  return null;
}
