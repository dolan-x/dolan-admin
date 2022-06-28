import path from "node:path";
import { defineConfig } from "vite";
import React from "@vitejs/plugin-react";
import Pages from "vite-plugin-pages";
import AutoImport from "unplugin-auto-import/vite";
import { presetAttributify, presetIcons, presetUno } from "unocss";
import Unocss from "unocss/vite";
import Yaml from "@rollup/plugin-yaml";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "~/": `${path.resolve(__dirname, "src")}/`,
    },
  },
  plugins: [
    React(),

    Pages(),

    AutoImport({
      imports: [
        "react",
        {
          "react-i18next": [
            "useTranslation",
          ],
        },
      ],
      dts: "src/auto-imports.d.ts",
    }),

    Unocss({
      shortcuts: [],
      presets: [
        presetUno(),
        presetAttributify(),
        presetIcons({
          scale: 1.2,
          extraProperties: {
            "display": "inline-block",
            "height": "1.4em",
            "width": "1.4em",
            "vertical-align": "text-bottom",
          },
        }),
      ],
    }),

    Yaml(),
  ],
  optimizeDeps: {
    include: [
      "@douyinfe/semi-ui",
    ],
  },
});
