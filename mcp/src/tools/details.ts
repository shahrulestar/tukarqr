import { getDuitNowQrDetails } from "@tukarqr/qr-core";

export function getDuitNowQrDetailsTool(payload: string) {
  return getDuitNowQrDetails(payload);
}
