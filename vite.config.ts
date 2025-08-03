import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  // Filter only variables you want to expose
  const exposedEnvVars = Object.keys(env)
    .filter((key) => key.startsWith("VITE_") || key.startsWith("PUBLIC_"))
    .reduce((obj: any, key) => {
      obj[`process.env.${key}`] = JSON.stringify(env[key]);
      return obj;
    }, {});

  return {
    server: {
      host: "::",
      port: 5173,
    },
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    define: {
      'process.env': env
    }
  };
});
