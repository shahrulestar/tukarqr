export const MAX_FILE_SIZE_BYTES = 30 * 1024 * 1024; // 30MB
export const MAX_IMAGE_DIMENSION = 2048; // cap width/height for processing
export const MAX_IMAGE_DIMENSION_HARD = 4096; // reject if larger

export const SUPPORTED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/bmp",
  "image/avif",
  "image/tiff",
  "image/heic",
  "image/heif",
];

export const SUPPORTED_EXTENSIONS =
  /\.(jpg|jpeg|png|gif|webp|bmp|heic|heif|tiff|tif|avif)(\?.*)?$/i;

const HEIC_MIME_TYPES = ["image/heic", "image/heif"];
const HEIC_EXTENSIONS = /\.(heic|heif)(\?.*)?$/i;

export function isHeicFile(file: File): boolean {
  return (
    (file.type && HEIC_MIME_TYPES.includes(file.type)) ||
    HEIC_EXTENSIONS.test(file.name)
  );
}

export async function convertHeicToJpeg(blob: Blob): Promise<Blob> {
  const heic2any = (await import("heic2any")).default;
  const result = await heic2any({
    blob,
    toType: "image/jpeg",
    quality: 0.9,
  });
  return Array.isArray(result) ? result[0] : result;
}
