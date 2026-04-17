import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/fundbordet/",
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: "fundbrdet-ui/styles.css",
        replacement: fileURLToPath(
          new URL("./src/ui-library/styles.css", import.meta.url),
        ),
      },
      {
        find: "fundbrdet-ui",
        replacement: fileURLToPath(
          new URL("./src/ui-library/index.ts", import.meta.url),
        ),
      },
    ],
  },
});
