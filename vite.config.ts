import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vitest/config";
import { loadEnv } from "vite";
import { adminAuthPlugin } from "./server/adminAuth";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode, command }) => {
  const environment = loadEnv(mode, process.cwd(), "");

  const localAdminAuth =
    command === "serve" &&
    !!environment.ADMIN_USER &&
    !!environment.ADMIN_PASSWORD;

  return {
    plugins: [
      vue(),
      tailwindcss(),
      ...(localAdminAuth
        ? [
            adminAuthPlugin({
              email: environment.ADMIN_USER,
              password: environment.ADMIN_PASSWORD,
            }),
          ]
        : []),
    ],
    define: {
      "import.meta.env.VITE_LOCAL_ADMIN_AUTH": JSON.stringify(localAdminAuth),
    },
    resolve: {
      alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
    },
    test: { environment: "jsdom", clearMocks: true },
  };
});
