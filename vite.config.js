import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  define: {
    "process.env": process.env,
  },
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;

          if (id.includes("@mui")) return "vendor-mui";
          if (id.includes("fullcalendar")) return "vendor-fullcalendar";
          if (id.includes("@react-pdf") || id.includes("react-pdf"))
            return "vendor-pdf";
          if (
            id.includes("recharts") ||
            id.includes("apexcharts") ||
            id.includes("chart.js")
          )
            return "vendor-charts";
          if (id.includes("googleapis") || id.includes("@react-google-maps"))
            return "vendor-google";
          if (id.includes("lottie")) return "vendor-lottie";

          return "vendor";
        },
      },
    },
  },
  server: {
    host: "0.0.0.0",
    port: 5173,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@mui/x-date-pickers/AdapterDateFns":
        "@mui/x-date-pickers/AdapterDateFnsV3",
    },
  },
});
