import QRCode from "qrcode";
import { PRIMARY_MAGENTA, type QrModuleStyle } from "./export-types";

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function buildQrModuleSvg(
  payload: string,
  options?: { style?: QrModuleStyle; margin?: number; fgColor?: string }
): { svg: string; cells: number } {
  const style = options?.style ?? "classic";
  const margin = options?.margin ?? 2;
  const fgColor = options?.fgColor ?? PRIMARY_MAGENTA;
  const qrData = QRCode.create(payload, { errorCorrectionLevel: "M" });
  const modSize = qrData.modules.size;
  const data = qrData.modules.data;
  const numCells = modSize + margin * 2;
  const rx = style === "rounded" ? 0.4 : 0;

  const rects: string[] = [
    `<rect x="0" y="0" width="${numCells}" height="${numCells}" fill="#ffffff"/>`,
  ];

  for (let row = 0; row < modSize; row++) {
    for (let col = 0; col < modSize; col++) {
      const idx = row * modSize + col;
      if (!data[idx]) continue;
      const x = margin + col;
      const y = margin + row;
      rects.push(
        `<rect x="${x}" y="${y}" width="1" height="1" rx="${rx}" ry="${rx}" fill="${escapeXml(fgColor)}"/>`
      );
    }
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${numCells} ${numCells}" width="${numCells}" height="${numCells}" shape-rendering="crispEdges">${rects.join("")}</svg>`;
  return { svg, cells: numCells };
}
