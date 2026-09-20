import { parseDuitNowQr } from "@tukarqr/qr-core";
import { validateDuitNowQr } from "./validate-duitnow-qr";

export function parseDuitNowQrTool(payload: string) {
  const validation = validateDuitNowQr(payload);
  if (!validation.valid) return validation;

  const parsed = parseDuitNowQr(payload);
  return {
    valid: true,
    merchantName: parsed.merchantName,
    bankName: parsed.bankName,
    amount: parsed.amount,
    countryCode: parsed.countryCode ?? "MY",
  };
}
