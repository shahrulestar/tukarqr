import { McpServer } from "@modelcontextprotocol/server";
import { createMcpHandler } from "agents/mcp/server";
import { z } from "zod";
import { presentEncodeResult, buildToolResult } from "./tool-result";
import { convertQrImage, convertQrImagesBulk } from "./tools/convert-qr";
import { decodeQrImage, decodeQrImagesBulk } from "./tools/decode-qr";
import { getDuitNowQrDetailsTool } from "./tools/details";
import { encodeQr } from "./tools/encode-qr";
import { encodeQrBulk } from "./tools/encode-qr-bulk";
import { parseDuitNowQrTool } from "./tools/parse-duitnow-qr";
import { validateDuitNowQr } from "./tools/validate-duitnow-qr";

const STYLE_HINT =
  "Same export settings as tukarqr.my: layout duitnow frame vs plain QR only, qrStyle classic vs rounded, showBankName, outerBg white vs transparent, ratio 1:1 (default) or 3:4. File format png or svg. If the user does not specify a style, use website defaults immediately — duitnow, classic, show bank, white, 1:1, PNG. Do not ask a style questionnaire first. Do not invent decorative QR images. Do not add a DuitNow logo. Frame + QR modules use #ec4899; bottom bar text exactly MALAYSIA NATIONAL QR. Reject payloads that are not valid Malaysia DuitNow QR.";

function jsonResult(data: unknown) {
  return buildToolResult(data);
}

/** Mirrors website ExportSettings (+ file format). Default ratio is square 1:1. */
const exportSettingsFields = {
  format: z
    .enum(["png", "svg"])
    .optional()
    .describe("Output file format. Default png."),
  layout: z
    .enum(["duitnow", "plain"])
    .optional()
    .describe(
      "Export format: duitnow = Malaysia National QR frame; plain = QR only (no merchant/bank on image)."
    ),
  qrStyle: z
    .enum(["classic", "rounded"])
    .optional()
    .describe("QR style: classic = square modules; rounded = rounded modules."),
  showBankName: z
    .boolean()
    .optional()
    .describe("Show bank name under merchant on the framed export. Default true."),
  outerBg: z
    .enum(["white", "transparent"])
    .optional()
    .describe("Background: white or transparent. Default white."),
  ratio: z
    .enum(["1:1", "3:4"])
    .optional()
    .describe("Image size: square 1:1 (default) or portrait 3:4."),
  merchantName: z.string().max(80).optional(),
  bankName: z.string().max(45).optional(),
};

function createServer() {
  const server = new McpServer({
    name: "tukarqr",
    version: "0.2.0",
  });

  server.registerTool(
    "get_validate_duitnow_qr",
    {
      description:
        "Validate a DuitNow EMVCo QR payload string. Does not accept images.",
      inputSchema: z.object({
        payload: z.string().min(1).max(5000),
      }),
    },
    async ({ payload }) => jsonResult(validateDuitNowQr(payload))
  );

  server.registerTool(
    "get_parse_duitnow_qr",
    {
      description:
        "Short summary of a DuitNow QR: merchant, bank, amount, country. For full TLV/raw fields use get_duitnow_qr_details.",
      inputSchema: z.object({
        payload: z.string().min(1).max(5000),
      }),
    },
    async ({ payload }) => jsonResult(parseDuitNowQrTool(payload))
  );

  server.registerTool(
    "get_duitnow_qr_details",
    {
      description:
        "Return raw EMVCo details for a DuitNow QR payload when the user asks what is in the QR: summary, AID, acquirer ID, city, amount, currency, CRC, full TLV map, nested merchant-account TLV, and the raw payload. Do not invent tags.",
      inputSchema: z.object({
        payload: z.string().min(1).max(5000),
      }),
    },
    async ({ payload }) => jsonResult(getDuitNowQrDetailsTool(payload))
  );

  server.registerTool(
    "get_encode_qr",
    {
      description: `Encode a valid Malaysia DuitNow EMVCo payload as a TukarQR-styled PNG or SVG. PNG is returned as an image. ${STYLE_HINT}`,
      inputSchema: z.object({
        payload: z.string().min(1).max(5000),
        ...exportSettingsFields,
      }),
    },
    async (args) => presentEncodeResult(await encodeQr(args))
  );

  server.registerTool(
    "get_encode_qr_bulk",
    {
      description: `Export up to 10 QR payloads as a ZIP of styled PNGs using one shared style. ${STYLE_HINT} Ask export settings once for the whole batch.`,
      inputSchema: z.object({
        items: z
          .array(
            z.object({
              payload: z.string().min(1).max(5000),
              name: z.string().max(80).optional(),
            })
          )
          .min(1)
          .max(10),
        layout: exportSettingsFields.layout,
        qrStyle: exportSettingsFields.qrStyle,
        outerBg: exportSettingsFields.outerBg,
        ratio: exportSettingsFields.ratio,
        showBankName: exportSettingsFields.showBankName,
      }),
    },
    async (args) => jsonResult(await encodeQrBulk(args))
  );

  server.registerTool(
    "get_decode_qr_image",
    {
      description:
        "Decode a PNG or JPEG image (base64 or data URL) to an EMVCo payload string. HEIC is not supported. Does not store the image.",
      inputSchema: z.object({
        imageBase64: z.string().min(1),
        mimeType: z.enum(["image/png", "image/jpeg", "image/jpg"]).optional(),
      }),
    },
    async (args) => jsonResult(decodeQrImage(args))
  );

  server.registerTool(
    "get_decode_qr_images_bulk",
    {
      description:
        "Decode up to 10 PNG/JPEG images (base64) to EMVCo payloads. Per-item failures do not abort the batch. HEIC is not supported.",
      inputSchema: z.object({
        images: z
          .array(
            z.object({
              imageBase64: z.string().min(1),
              mimeType: z
                .enum(["image/png", "image/jpeg", "image/jpg"])
                .optional(),
              name: z.string().max(80).optional(),
            })
          )
          .min(1)
          .max(10),
      }),
    },
    async ({ images }) => jsonResult(decodeQrImagesBulk(images))
  );

  server.registerTool(
    "get_convert_qr_image",
    {
      description: `Decode one PNG/JPEG, validate it as Malaysia DuitNow, and export a styled QR in one call. PNG is returned as an image. HEIC is not supported. ${STYLE_HINT}`,
      inputSchema: z.object({
        imageBase64: z.string().min(1),
        mimeType: z.enum(["image/png", "image/jpeg", "image/jpg"]).optional(),
        name: z.string().max(80).optional(),
        ...exportSettingsFields,
      }),
    },
    async (args) => presentEncodeResult(await convertQrImage(args))
  );

  server.registerTool(
    "get_convert_qr_images_bulk",
    {
      description: `Decode up to 10 PNG/JPEG images, validate each as Malaysia DuitNow, and return a ZIP of styled PNGs. Per-item failures do not abort the batch. HEIC is not supported. ${STYLE_HINT}`,
      inputSchema: z.object({
        images: z
          .array(
            z.object({
              imageBase64: z.string().min(1),
              mimeType: z
                .enum(["image/png", "image/jpeg", "image/jpg"])
                .optional(),
              name: z.string().max(80).optional(),
            })
          )
          .min(1)
          .max(10),
        layout: exportSettingsFields.layout,
        qrStyle: exportSettingsFields.qrStyle,
        outerBg: exportSettingsFields.outerBg,
        ratio: exportSettingsFields.ratio,
        showBankName: exportSettingsFields.showBankName,
      }),
    },
    async (args) => jsonResult(await convertQrImagesBulk(args))
  );

  return server;
}

const handler = createMcpHandler(createServer, {
  route: "/mcp",
  allowedHostnames: ["mcp.tukarqr.my", "localhost", "127.0.0.1"],
});

export default {
  fetch(request: Request, env: unknown, ctx: ExecutionContext) {
    const url = new URL(request.url);
    if (url.pathname === "/" || url.pathname === "") {
      return new Response("TukarQR MCP", { status: 200 });
    }
    return handler(request, env, ctx);
  },
};
