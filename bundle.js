import { globSync as glob, rmSync } from "node:fs";
import * as esbuild from "esbuild";

const cssEntrypoints = [
  "./styles/index.css",
  "./styles/fonts/subfont.css",
  ...glob("./styles/pages/**/*.css"),
];
const jsEntrypoints = [
  ...glob("./scripts/*.ts"),
  ...glob("./scripts/**/index.ts"),
];

const watch = "WATCH" in process.env;
const isDevelopment = watch;

console.log("Development build:", isDevelopment);

const ctx = await esbuild.context({
  entryPoints: [...jsEntrypoints, ...cssEntrypoints],
  outdir: "./public/dist",
  bundle: true,
  minify: !isDevelopment,
  sourcemap: isDevelopment,
  platform: "browser",
  format: "esm",
  loader: {
    ".woff2": "file",
  },
});

// Clean the output directory first
rmSync("./public/dist", { recursive: true, force: true });

if (watch) {
  console.log("Watching for changes");
  await ctx.watch();
} else {
  console.log("Doing a one-shot build");

  await ctx.rebuild();
  await ctx.dispose();

  console.log("Build complete");
}
