export type ToolContent =
  | { type: "text"; text: string }
  | { type: "image"; mimeType: "image/png"; data: string };

export function buildToolResult(data: unknown, pngBase64?: string) {
  const content: ToolContent[] = [
    { type: "text", text: JSON.stringify(data, null, 2) },
  ];
  if (pngBase64) {
    content.push({ type: "image", mimeType: "image/png", data: pngBase64 });
  }
  return { content };
}

/** PNG bytes go in an image block. SVG and ZIP stay in the JSON text. */
export function presentEncodeResult(result: {
  format?: string;
  data?: string;
  error?: string;
}) {
  if (result.format === "png" && result.data && !result.error) {
    const { data, ...summary } = result;
    return buildToolResult(summary, data);
  }
  return buildToolResult(result);
}
