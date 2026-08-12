import { DISCORD_RATING_WEBHOOK_URL } from "@/lib/site-config";

export type ExportNotifyAction = "save" | "share";

export function buildExportEmbedDescription(action: ExportNotifyAction): string {
  return action === "save" ? "User saved a QR" : "User shared a QR";
}

function buildDiscordPayload(action: ExportNotifyAction) {
  return {
    embeds: [
      {
        title: "TukarQR export",
        description: buildExportEmbedDescription(action),
        color: 5814783,
      },
    ],
  };
}

export async function notifyExportToDiscord(
  action: ExportNotifyAction
): Promise<void> {
  if (!DISCORD_RATING_WEBHOOK_URL) return;

  try {
    const formData = new FormData();
    formData.append(
      "payload_json",
      JSON.stringify(buildDiscordPayload(action))
    );

    await fetch(DISCORD_RATING_WEBHOOK_URL, {
      method: "POST",
      body: formData,
      mode: "no-cors",
    });
  } catch {
    // Fire-and-forget: export success should not depend on webhook delivery.
  }
}
