import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
      "@tukarqr/qr-core": path.resolve(__dirname, "./packages/qr-core/src/index.ts"),
    },
  },
});
