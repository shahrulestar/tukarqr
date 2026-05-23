import { toast } from "sonner";
import { SITE_URL } from "@/lib/site-config";

const SHARE_TITLE = "TukarQR";
const SHARE_TEXT =
  "Tukar DuitNow QR kabur kepada imej yang jelas — percuma dan terus dalam pelayar.";

function canUseNativeShare(data: ShareData): boolean {
  if (typeof navigator === "undefined" || typeof navigator.share !== "function") {
    return false;
  }
  if (typeof navigator.canShare === "function") {
    return navigator.canShare(data);
  }
  return true;
}

function getSharePayloads(): ShareData[] {
  return [
    { title: SHARE_TITLE, text: SHARE_TEXT, url: SITE_URL },
    { title: SHARE_TITLE, url: SITE_URL },
    { url: SITE_URL },
  ];
}

async function copyLinkToClipboard(): Promise<void> {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(SITE_URL);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = SITE_URL;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  const copied = document.execCommand("copy");
  document.body.removeChild(textarea);

  if (!copied) {
    throw new Error("Gagal menyalin pautan ke papan keratan.");
  }
}

export async function shareApp(): Promise<void> {
  for (const payload of getSharePayloads()) {
    if (!canUseNativeShare(payload)) continue;

    try {
      await navigator.share(payload);
      return;
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        throw error;
      }
    }
  }

  await copyLinkToClipboard();
  toast.success("Berjaya", {
    description: "Pautan aplikasi ini disalin ke papan keratan.",
  });
}
