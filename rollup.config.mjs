import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";

export default [
  {
    input: "dist/esm/index.js",
    plugins: [nodeResolve(), commonjs()],
    output: {
      file: "dist/plugin.js",
      format: "iife",
      name: "capacitorCapacitorIvsPlayer",
      globals: {
        "@capacitor/core": "capacitorExports",
      },
      sourcemap: true,
      inlineDynamicImports: true,
    },
    external: ["@capacitor/core"],
  },
  {
    input: "dist/esm/index.js",
    output: {
      file: "dist/plugin.cjs.js",
      format: "cjs",
      sourcemap: true,
      inlineDynamicImports: true,
    },
    external: ["@capacitor/core", "@webview-native-ui/engine"],
  },
];
