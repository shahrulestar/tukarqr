import { getBankNameByAcquirerId } from "@/lib/duitnow-acquirer-ids";

const DUITNOW_MALAYSIA_AID = "A0000006150001";
const MAX_PAYLOAD_LENGTH = 5000;
const EMVCO_ASCII = /^[\x20-\x7E]*$/;

export const DUITNOW_QR_ERRORS = {
  invalidFormat:
    "Format DuitNow QR tidak sah. Kod QR mungkin rosak atau bukan DuitNow QR pembayaran.",
  notDuitNow:
    "Kod QR ini bukan DuitNow QR pembayaran. Hanya kod DuitNow QR Malaysia disokong.",
  invalidOrCorrupt: "Kod DuitNow QR tidak sah atau rosak.",
} as const;

export function parseEmvCoTlv(payload: string): Map<string, string> {
  const map = new Map<string, string>();
  let i = 0;
  while (i < payload.length - 4) {
    const id = payload.slice(i, i + 2);
    const lenStr = payload.slice(i + 2, i + 4);
    const len = parseInt(lenStr, 10);
    if (isNaN(len) || len < 0 || i + 4 + len > payload.length) break;
    const value = payload.slice(i + 4, i + 4 + len);
    map.set(id, value);
    i += 4 + len;
  }
  return map;
}

function getMerchantAccountSubTag(
  templateValue: string,
  subTagId: string
): string | null {
  let i = 0;
  while (i < templateValue.length - 4) {
    const id = templateValue.slice(i, i + 2);
    const lenStr = templateValue.slice(i + 2, i + 4);
    const len = parseInt(lenStr, 10);
    if (isNaN(len) || len < 0 || i + 4 + len > templateValue.length) break;
    const value = templateValue.slice(i + 4, i + 4 + len);
    if (id === subTagId) return value;
    i += 4 + len;
  }
  return null;
}

function getMerchantAccountAid(templateValue: string): string | null {
  return getMerchantAccountSubTag(templateValue, "00");
}

function crc16CcittFalse(data: string): number {
  let crc = 0xffff;
  const poly = 0x1021;
  for (let i = 0; i < data.length; i++) {
    crc ^= data.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      crc = (crc & 0x8000) ? (crc << 1) ^ poly : crc << 1;
      crc &= 0xffff;
    }
  }
  return crc;
}

function validateEmvCoCrc(payload: string): boolean {
  const crcIndex = payload.lastIndexOf("6304");
  if (crcIndex === -1 || crcIndex + 8 > payload.length) return false;
  const dataForCrc = payload.slice(0, crcIndex + 4);
  const storedCrc = payload.slice(crcIndex + 4, crcIndex + 8);
  const computed = crc16CcittFalse(dataForCrc)
    .toString(16)
    .toUpperCase()
    .padStart(4, "0");
  return computed === storedCrc;
}

export function isDuitNowQr(
  payload: string
): { valid: boolean; reason?: string } {
  if (typeof payload !== "string" || !payload) {
    return {
      valid: false,
      reason: DUITNOW_QR_ERRORS.invalidFormat,
    };
  }
  if (payload.length > MAX_PAYLOAD_LENGTH) {
    return {
      valid: false,
      reason: DUITNOW_QR_ERRORS.invalidFormat,
    };
  }
  if (!EMVCO_ASCII.test(payload)) {
    return {
      valid: false,
      reason: DUITNOW_QR_ERRORS.invalidFormat,
    };
  }
  const tlv = parseEmvCoTlv(payload);
  const formatIndicator = tlv.get("00");
  if (formatIndicator !== "02") {
    return {
      valid: false,
      reason: DUITNOW_QR_ERRORS.notDuitNow,
    };
  }
  const countryCode = tlv.get("58");
  if (countryCode !== "MY") {
    return {
      valid: false,
      reason: DUITNOW_QR_ERRORS.notDuitNow,
    };
  }
  const merchantAccount = tlv.get("26");
  if (!merchantAccount) {
    return {
      valid: false,
      reason: DUITNOW_QR_ERRORS.invalidFormat,
    };
  }
  const aid = getMerchantAccountAid(merchantAccount);
  if (aid !== DUITNOW_MALAYSIA_AID) {
    return {
      valid: false,
      reason: DUITNOW_QR_ERRORS.notDuitNow,
    };
  }
  if (!validateEmvCoCrc(payload)) {
    return {
      valid: false,
      reason: DUITNOW_QR_ERRORS.invalidOrCorrupt,
    };
  }
  return { valid: true };
}

export function parseEmvCoMerchantName(payload: string): string | null {
  const tlv = parseEmvCoTlv(payload);
  const value = tlv.get("59");
  return value?.trim() || null;
}

/** Tag 26 sub-tag 01 = Acquirer ID. Map to bank name via PayNet Table 9. */
export function parseEmvCoBankName(payload: string): string | null {
  const tlv = parseEmvCoTlv(payload);
  const merchantAccount = tlv.get("26");
  if (!merchantAccount) return null;
  const acquirerId = getMerchantAccountSubTag(merchantAccount, "01");
  if (!acquirerId) return null;
  return getBankNameByAcquirerId(acquirerId);
}

/** Tag 54 = Transaction amount. Format: "10.00" or "458" + amount for MYR. */
export function parseEmvCoAmount(payload: string): string | null {
  const tlv = parseEmvCoTlv(payload);
  const value = tlv.get("54")?.trim();
  if (!value) return null;
  const amountStr =
    /^\d{3}[\d.]+$/.test(value) && value.length > 4
      ? value.slice(3)
      : value;
  const num = parseFloat(amountStr);
  if (isNaN(num) || num < 0) return null;
  return `RM ${num.toFixed(2)}`;
}
