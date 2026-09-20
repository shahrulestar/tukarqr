import { getBankNameByAcquirerId } from "./duitnow-acquirer-ids";

const DUITNOW_MALAYSIA_AID = "A0000006150001";
const MAX_PAYLOAD_LENGTH = 5000;
const EMVCO_ASCII = /^[\x20-\x7E]*$/;

export type DuitNowReasonCode =
  | "invalid_format"
  | "not_duitnow"
  | "invalid_or_corrupt";

export interface DuitNowValidationResult {
  valid: boolean;
  reasonCode?: DuitNowReasonCode;
}

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

export function isDuitNowQr(payload: string): DuitNowValidationResult {
  if (typeof payload !== "string" || !payload) {
    return { valid: false, reasonCode: "invalid_format" };
  }
  if (payload.length > MAX_PAYLOAD_LENGTH) {
    return { valid: false, reasonCode: "invalid_format" };
  }
  if (!EMVCO_ASCII.test(payload)) {
    return { valid: false, reasonCode: "invalid_format" };
  }
  const tlv = parseEmvCoTlv(payload);
  const formatIndicator = tlv.get("00");
  if (formatIndicator !== "02") {
    return { valid: false, reasonCode: "not_duitnow" };
  }
  const countryCode = tlv.get("58");
  if (countryCode !== "MY") {
    return { valid: false, reasonCode: "not_duitnow" };
  }
  const merchantAccount = tlv.get("26");
  if (!merchantAccount) {
    return { valid: false, reasonCode: "invalid_format" };
  }
  const aid = getMerchantAccountAid(merchantAccount);
  if (aid !== DUITNOW_MALAYSIA_AID) {
    return { valid: false, reasonCode: "not_duitnow" };
  }
  if (!validateEmvCoCrc(payload)) {
    return { valid: false, reasonCode: "invalid_or_corrupt" };
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

export function parseDuitNowQr(payload: string) {
  const validation = isDuitNowQr(payload);
  if (!validation.valid) {
    return {
      valid: false as const,
      reasonCode: validation.reasonCode,
      merchantName: null,
      bankName: null,
      amount: null,
      countryCode: null as string | null,
    };
  }

  const tlv = parseEmvCoTlv(payload);
  return {
    valid: true as const,
    merchantName: parseEmvCoMerchantName(payload),
    bankName: parseEmvCoBankName(payload),
    amount: parseEmvCoAmount(payload),
    countryCode: tlv.get("58") ?? "MY",
  };
}
