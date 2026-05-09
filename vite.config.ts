import { defineConfig } from "vite";
import uni from "@dcloudio/vite-plugin-uni";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [uni()],
  server: {
    port: 8080,
    proxy: {
      // 开发时代理 API 请求到后端
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  }
});
