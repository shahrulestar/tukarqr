import { describe, it, expect } from "vitest";
import {
  isHeicFile,
  MAX_FILE_SIZE_BYTES,
  MAX_IMAGE_DIMENSION,
  MAX_IMAGE_DIMENSION_HARD,
  SUPPORTED_MIME_TYPES,
  SUPPORTED_EXTENSIONS,
} from "../image-validation";

describe("isHeicFile", () => {
  it("returns true for HEIC mime type", () => {
    const file = new File([], "test.heic", { type: "image/heic" });
    expect(isHeicFile(file)).toBe(true);
  });

  it("returns true for HEIF mime type", () => {
    const file = new File([], "test.heif", { type: "image/heif" });
    expect(isHeicFile(file)).toBe(true);
  });

  it("returns true for .heic extension when type is empty", () => {
    const file = new File([], "photo.heic", { type: "" });
    expect(isHeicFile(file)).toBe(true);
  });

  it("returns true for .heif extension", () => {
    const file = new File([], "photo.heif", { type: "application/octet-stream" });
    expect(isHeicFile(file)).toBe(true);
  });

  it("returns false for JPEG", () => {
    const file = new File([], "photo.jpg", { type: "image/jpeg" });
    expect(isHeicFile(file)).toBe(false);
  });

  it("returns false for PNG", () => {
    const file = new File([], "photo.png", { type: "image/png" });
    expect(isHeicFile(file)).toBe(false);
  });
});

describe("validation constants", () => {
  it("MAX_FILE_SIZE_BYTES is 30MB", () => {
    expect(MAX_FILE_SIZE_BYTES).toBe(30 * 1024 * 1024);
  });

  it("MAX_IMAGE_DIMENSION is 2048", () => {
    expect(MAX_IMAGE_DIMENSION).toBe(2048);
  });

  it("MAX_IMAGE_DIMENSION_HARD is 4096", () => {
    expect(MAX_IMAGE_DIMENSION_HARD).toBe(4096);
  });

  it("SUPPORTED_MIME_TYPES includes common formats", () => {
    expect(SUPPORTED_MIME_TYPES).toContain("image/jpeg");
    expect(SUPPORTED_MIME_TYPES).toContain("image/png");
    expect(SUPPORTED_MIME_TYPES).toContain("image/heic");
  });

  it("SUPPORTED_EXTENSIONS matches valid extensions", () => {
    expect(SUPPORTED_EXTENSIONS.test("photo.jpg")).toBe(true);
    expect(SUPPORTED_EXTENSIONS.test("photo.HEIC")).toBe(true);
    expect(SUPPORTED_EXTENSIONS.test("photo.webp")).toBe(true);
    expect(SUPPORTED_EXTENSIONS.test("photo.svg")).toBe(false);
  });
});
