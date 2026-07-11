import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      // shadcn-style path (this repo uses `src/components/UI` today)
      {
        find: "@/components/ui",
        replacement: fileURLToPath(new URL("./src/components/UI", import.meta.url)),
      },
      {
        find: "@",
        replacement: fileURLToPath(new URL("./src", import.meta.url)),
      },
    ],
  },
});
