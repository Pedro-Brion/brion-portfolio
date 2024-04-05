import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite' // Components autoimport

import { fileURLToPath, URL } from "url";
import UnoCSS from 'unocss/vite'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Components({
      dts:true,
    }),
    UnoCSS(),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "~": fileURLToPath(new URL("./src/components", import.meta.url)),
    },
  },
})
