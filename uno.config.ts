// uno.config.ts
import { defineConfig } from "unocss";
import presetIcons from "@unocss/preset-icons";
import presetMini from "@unocss/preset-mini";

export default defineConfig({
  presets: [
    presetIcons({
      /* options */
    }),
    presetMini(),
    // ...other presets
  ],
  theme: {
    // ...
    colors: {
      primaryLight: "#c8d5bb",
      primaryDark: "#47585c",
    },
  },
});
