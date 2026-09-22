import JSZip from "jszip";
import { MAX_BATCH_SIZE } from "@tukarqr/qr-core";
import { encodeQr, type EncodeQrInput } from "./encode-qr";

export async function encodeQrBulk(input: {
  items: Array<{ payload: string; name?: string }>;
  layout?: EncodeQrInput["layout"];
  qrStyle?: EncodeQrInput["qrStyle"];
  outerBg?: EncodeQrInput["outerBg"];
  ratio?: EncodeQrInput["ratio"];
  showBankName?: EncodeQrInput["showBankName"];
  format?: "png";
}) {
  const items = input.items.slice(0, MAX_BATCH_SIZE);
  const zip = new JSZip();
  const results: Array<{ name: string; ok: boolean; error?: string }> = [];

  for (const [index, item] of items.entries()) {
    const encoded = await encodeQr({
      payload: item.payload,
      format: "png",
      layout: input.layout,
      qrStyle: input.qrStyle,
      outerBg: input.outerBg,
      ratio: input.ratio,
      showBankName: input.showBankName,
    });
    if ("error" in encoded && encoded.error) {
      results.push({
        name: item.name ?? `qr-${index + 1}.png`,
        ok: false,
        error: encoded.error,
      });
      continue;
    }
    const filename =
      item.name ??
      ("filenameHint" in encoded ? encoded.filenameHint : `qr-${index + 1}.png`) ??
      `qr-${index + 1}.png`;
    const safeName = filename.endsWith(".png") ? filename : `${filename}.png`;
    zip.file(safeName, encoded.data ?? "", { base64: true });
    results.push({ name: safeName, ok: true });
  }

  const zipBytes = await zip.generateAsync({ type: "uint8array" });
  let binary = "";
  for (let i = 0; i < zipBytes.length; i += 0x8000) {
    binary += String.fromCharCode(...zipBytes.subarray(i, i + 0x8000));
  }

  return {
    format: "zip" as const,
    mimeType: "application/zip",
    data: btoa(binary),
    count: results.filter((r) => r.ok).length,
    truncated: input.items.length > MAX_BATCH_SIZE,
    results,
  };
}
