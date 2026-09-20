import {
  isDuitNowQr,
  type DuitNowReasonCode,
} from "@tukarqr/qr-core";

const REASON_MESSAGES: Record<DuitNowReasonCode, string> = {
  invalid_format: "Invalid DuitNow QR format",
  not_duitnow: "Not a Malaysia DuitNow payment QR",
  invalid_or_corrupt: "DuitNow QR is invalid or corrupt",
};

export function validateDuitNowQr(payload: string) {
  const result = isDuitNowQr(payload);
  if (result.valid) return { valid: true };
  const reasonCode = result.reasonCode ?? "invalid_format";
  return {
    valid: false,
    reasonCode,
    reason: REASON_MESSAGES[reasonCode],
  };
}
