import {
  isDuitNowQr as isDuitNowQrCore,
  parseEmvCoAmount,
  parseEmvCoBankName,
  parseEmvCoMerchantName,
  parseEmvCoTlv,
  type DuitNowReasonCode,
} from "@tukarqr/qr-core";
import { t } from "@/lib/i18n";

export { parseEmvCoAmount, parseEmvCoBankName, parseEmvCoMerchantName, parseEmvCoTlv };

export const DUITNOW_QR_ERRORS = {
  get invalidFormat() {
    return t("errors.duitnow.invalidFormat");
  },
  get notDuitNow() {
    return t("errors.duitnow.notDuitNow");
  },
  get invalidOrCorrupt() {
    return t("errors.duitnow.invalidOrCorrupt");
  },
};

const REASON_CODE_TO_MESSAGE: Record<DuitNowReasonCode, () => string> = {
  invalid_format: () => DUITNOW_QR_ERRORS.invalidFormat,
  not_duitnow: () => DUITNOW_QR_ERRORS.notDuitNow,
  invalid_or_corrupt: () => DUITNOW_QR_ERRORS.invalidOrCorrupt,
};

export function isDuitNowQr(
  payload: string
): { valid: boolean; reason?: string } {
  const result = isDuitNowQrCore(payload);
  if (result.valid) return { valid: true };
  return {
    valid: false,
    reason: result.reasonCode
      ? REASON_CODE_TO_MESSAGE[result.reasonCode]()
      : DUITNOW_QR_ERRORS.invalidFormat,
  };
}
