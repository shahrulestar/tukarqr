import { MAX_BATCH_SIZE } from "./export-types";
import { getBankNameByAcquirerId } from "./duitnow-acquirer-ids";
import {
  isDuitNowQr,
  parseEmvCoAmount,
  parseEmvCoBankName,
  parseEmvCoMerchantName,
  parseEmvCoTlv,
} from "./emvco";

export function parseNestedTlv(value: string): Record<string, string> {
  const map: Record<string, string> = {};
  let i = 0;
  while (i < value.length - 4) {
    const id = value.slice(i, i + 2);
    const lenStr = value.slice(i + 2, i + 4);
    const len = parseInt(lenStr, 10);
    if (isNaN(len) || len < 0 || i + 4 + len > value.length) break;
    map[id] = value.slice(i + 4, i + 4 + len);
    i += 4 + len;
  }
  return map;
}

function mapToRecord(map: Map<string, string>): Record<string, string> {
  return Object.fromEntries(map.entries());
}

function payloadCrcOk(payload: string): boolean {
  const crcIndex = payload.lastIndexOf("6304");
  if (crcIndex === -1 || crcIndex + 8 > payload.length) return false;
  const dataForCrc = payload.slice(0, crcIndex + 4);
  const storedCrc = payload.slice(crcIndex + 4, crcIndex + 8);
  let crc = 0xffff;
  const poly = 0x1021;
  for (let i = 0; i < dataForCrc.length; i++) {
    crc ^= dataForCrc.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      crc = crc & 0x8000 ? (crc << 1) ^ poly : crc << 1;
      crc &= 0xffff;
    }
  }
  return (
    crc.toString(16).toUpperCase().padStart(4, "0") === storedCrc
  );
}

export function getDuitNowQrDetails(payload: string) {
  const validation = isDuitNowQr(payload);
  const tlvMap = parseEmvCoTlv(payload);
  const tlv = mapToRecord(tlvMap);
  const merchantAccount = tlvMap.get("26");
  const merchantAccountTlv = merchantAccount
    ? parseNestedTlv(merchantAccount)
    : undefined;
  const acquirerId = merchantAccountTlv?.["01"] ?? null;
  const amountRaw = tlvMap.get("54")?.trim() ?? null;

  return {
    valid: validation.valid,
    reasonCode: validation.reasonCode,
    summary: {
      merchantName: parseEmvCoMerchantName(payload),
      bankName: parseEmvCoBankName(payload),
      amount: parseEmvCoAmount(payload),
      countryCode: tlvMap.get("58") ?? null,
    },
    payment: {
      aid: merchantAccountTlv?.["00"] ?? null,
      acquirerId,
      bankName: acquirerId ? getBankNameByAcquirerId(acquirerId) : null,
      merchantName: parseEmvCoMerchantName(payload),
      merchantCity: tlvMap.get("60")?.trim() ?? null,
      amount: parseEmvCoAmount(payload),
      amountRaw,
      currency: tlvMap.get("53") ?? null,
      payloadCrcOk: payloadCrcOk(payload),
    },
    tlv,
    merchantAccountTlv,
    payloadLength: payload.length,
    payload,
  };
}

export function clampBatchSize(count: number): number {
  return Math.min(Math.max(count, 0), MAX_BATCH_SIZE);
}
