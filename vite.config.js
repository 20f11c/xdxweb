import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0", // 允许局域网访问
    port: 5173,
    strictPort: true,
    proxy: {
      // 代理所有以 /api 开头的请求到后端服务器
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
        // 可选：重写路径，如果后端不需要 /api 前缀
        // rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
});
