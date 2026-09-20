import { McpServer } from "@modelcontextprotocol/server";
import { createMcpHandler } from "agents/mcp/server";
import { z } from "zod";
import { encodeQr } from "./tools/encode-qr";
import { parseDuitNowQrTool } from "./tools/parse-duitnow-qr";
import { validateDuitNowQr } from "./tools/validate-duitnow-qr";

function jsonResult(data: unknown) {
  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify(data, null, 2),
      },
    ],
  };
}

function createServer() {
  const server = new McpServer({
    name: "tukarqr",
    version: "0.1.0",
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
        "Validate and parse a DuitNow QR payload into merchant, bank, and amount fields.",
      inputSchema: z.object({
        payload: z.string().min(1).max(5000),
      }),
    },
    async ({ payload }) => jsonResult(parseDuitNowQrTool(payload))
  );

  server.registerTool(
    "get_encode_qr",
    {
      description:
        "Encode a QR payload string as a plain PNG (base64) or SVG. Does not apply the DuitNow frame.",
      inputSchema: z.object({
        payload: z.string().min(1).max(5000),
        format: z.enum(["png", "svg"]).optional(),
        size: z.number().int().min(64).max(2048).optional(),
      }),
    },
    async ({ payload, format, size }) =>
      jsonResult(await encodeQr(payload, format ?? "png", size ?? 512))
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
