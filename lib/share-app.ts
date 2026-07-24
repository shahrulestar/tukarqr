import { toast } from "sonner";
import { t } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site-config";

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
  const title = t("share.app.title");
  const text = t("share.app.text");
  return [
    { title, text, url: SITE_URL },
    { title, url: SITE_URL },
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
    throw new Error(t("share.app.copyFail"));
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
  toast.success(t("share.app.linkCopied"));
}
