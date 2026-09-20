import {
  NATIONAL_QR_LABEL,
  PRIMARY_MAGENTA,
  SYSTEM_FONT_STACK,
  resolveExportOptions,
  type QrExportOptions,
} from "./export-types";
import { parseEmvCoBankName, parseEmvCoMerchantName } from "./emvco";
import { buildQrModuleSvg } from "./qr-modules";

const INNER_PADDING_TOP_BOTTOM = 24;
const INNER_PADDING_LEFT_RIGHT = 36;
const MALAYSIA_QR_BORDER_TOP = 20;
const MALAYSIA_QR_BORDER_LEFT_RIGHT = 20;
const MALAYSIA_QR_BAR_HEIGHT = 100;
const MALAYSIA_QR_RADIUS = 16;
const MAX_BANK_NAME_LENGTH = 45;
const PLAIN_CANVAS_SIZE = 1000;
const PLAIN_PADDING_RATIO = 0.08;

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function embedQr(
  moduleSvg: string,
  x: number,
  y: number,
  size: number,
  cells: number
): string {
  const inner = moduleSvg
    .replace(/^<svg[^>]*>/, "")
    .replace(/<\/svg>$/, "");
  return `<g transform="translate(${x} ${y}) scale(${size / cells})">${inner}</g>`;
}

export function buildExportSvg(
  payload: string,
  partial?: Partial<QrExportOptions>
): { svg: string; width: number; height: number; options: QrExportOptions } {
  const parsedMerchant = parseEmvCoMerchantName(payload);
  const parsedBank = parseEmvCoBankName(payload);
  const options = resolveExportOptions({
    ...partial,
    merchantName: partial?.merchantName ?? parsedMerchant,
    bankName:
      (partial?.showBankName ?? true)
        ? (partial?.bankName ?? parsedBank)
        : null,
  });

  if (!(partial?.showBankName ?? true)) {
    options.bankName = null;
  } else if (options.bankName) {
    options.bankName = options.bankName.slice(0, MAX_BANK_NAME_LENGTH);
  }

  const { svg: moduleSvg, cells } = buildQrModuleSvg(payload, {
    style: options.qrStyle,
  });

  if (options.layout === "plain") {
    const padding = PLAIN_CANVAS_SIZE * PLAIN_PADDING_RATIO;
    const qrSize = PLAIN_CANVAS_SIZE - padding * 2;
    const bg =
      options.outerBg === "white"
        ? `<rect width="${PLAIN_CANVAS_SIZE}" height="${PLAIN_CANVAS_SIZE}" fill="#ffffff"/>`
        : "";
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${PLAIN_CANVAS_SIZE} ${PLAIN_CANVAS_SIZE}" width="${PLAIN_CANVAS_SIZE}" height="${PLAIN_CANVAS_SIZE}">${bg}${embedQr(moduleSvg, padding, padding, qrSize, cells)}</svg>`;
    return {
      svg,
      width: PLAIN_CANVAS_SIZE,
      height: PLAIN_CANVAS_SIZE,
      options: { ...options, layout: "plain", ratio: "1:1" },
    };
  }

  const merchantName = options.merchantName;
  const bankName = options.bankName;
  const includeText = Boolean(merchantName || bankName);
  const holderNameArea =
    includeText && (merchantName || bankName)
      ? merchantName && bankName
        ? 110
        : 80
      : 0;

  const totalWidth = options.ratio === "1:1" ? 1000 : 900;
  const totalHeight =
    options.ratio === "1:1" ? 1000 : Math.round(totalWidth * (4 / 3));
  const contentLeft = INNER_PADDING_LEFT_RIGHT;
  const contentTop = INNER_PADDING_TOP_BOTTOM;
  const contentWidth = totalWidth - INNER_PADDING_LEFT_RIGHT * 2;
  const contentHeight = totalHeight - INNER_PADDING_TOP_BOTTOM * 2;
  const frameSize = Math.min(contentWidth, contentHeight);
  const frameX = contentLeft + (contentWidth - frameSize) / 2;
  const frameY = contentTop + (contentHeight - frameSize) / 2;
  const borderLeft = MALAYSIA_QR_BORDER_LEFT_RIGHT;
  const borderTop = MALAYSIA_QR_BORDER_TOP;
  const barHeight = MALAYSIA_QR_BAR_HEIGHT;
  const radius = MALAYSIA_QR_RADIUS;
  const innerWidth = frameSize - borderLeft * 2;
  const whiteHeight = frameSize - borderTop - barHeight;
  const qrSize = Math.min(
    innerWidth - INNER_PADDING_TOP_BOTTOM * 2,
    whiteHeight - INNER_PADDING_TOP_BOTTOM * 2 - holderNameArea
  );
  const qrX = frameX + borderLeft + (innerWidth - qrSize) / 2;
  const qrY = frameY + borderTop + INNER_PADDING_TOP_BOTTOM;
  const outerRx = radius + Math.max(borderTop, borderLeft);
  const holderCenterX = frameX + borderLeft + innerWidth / 2;
  const holderTop = qrY + qrSize;

  const bg =
    options.outerBg === "white"
      ? `<rect width="${totalWidth}" height="${totalHeight}" fill="#ffffff"/>`
      : "";

  const texts: string[] = [];
  if (includeText) {
    if (merchantName && bankName) {
      texts.push(
        `<text x="${holderCenterX}" y="${holderTop + 22}" text-anchor="middle" dominant-baseline="middle" font-family="${SYSTEM_FONT_STACK}" font-size="44" font-weight="600" fill="#000000">${escapeXml(merchantName)}</text>`,
        `<text x="${holderCenterX}" y="${holderTop + 78}" text-anchor="middle" dominant-baseline="middle" font-family="${SYSTEM_FONT_STACK}" font-size="44" font-weight="600" fill="#000000">${escapeXml(bankName)}</text>`
      );
    } else {
      const label = merchantName || bankName || "";
      texts.push(
        `<text x="${holderCenterX}" y="${holderTop + holderNameArea / 2}" text-anchor="middle" dominant-baseline="middle" font-family="${SYSTEM_FONT_STACK}" font-size="44" font-weight="600" fill="#000000">${escapeXml(label)}</text>`
      );
    }
  }

  const nationalY = frameY + frameSize - barHeight / 2;
  texts.push(
    `<text x="${holderCenterX}" y="${nationalY}" text-anchor="middle" dominant-baseline="middle" font-family="${SYSTEM_FONT_STACK}" font-size="44" font-weight="600" fill="#ffffff">${NATIONAL_QR_LABEL}</text>`
  );

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalWidth} ${totalHeight}" width="${totalWidth}" height="${totalHeight}">
${bg}
<rect x="${frameX}" y="${frameY}" width="${frameSize}" height="${frameSize}" rx="${outerRx}" ry="${outerRx}" fill="${PRIMARY_MAGENTA}"/>
<rect x="${frameX + borderLeft}" y="${frameY + borderTop}" width="${innerWidth}" height="${whiteHeight}" rx="${radius}" ry="${radius}" fill="#ffffff"/>
${embedQr(moduleSvg, qrX, qrY, qrSize, cells)}
${texts.join("\n")}
</svg>`;

  return { svg, width: totalWidth, height: totalHeight, options };
}
