import { globSync as glob, rmSync } from "node:fs";
import * as esbuild from "esbuild";

const cssEntrypoints = [
  "./styles/index.css",
  "./styles/fonts/subfont.css",
  ...glob("./styles/pages/**/*.css"),
];
const jsEntrypoints = [...glob("./scripts/**/entrypoint.ts")];

const watch = "WATCH" in process.env;
const isDevelopment = watch;

console.log("Development build:", isDevelopment);

const baseOptions = {
  bundle: true,
  minify: !isDevelopment,
  sourcemap: isDevelopment,
  platform: "browser",
};

// Create a separate context for bundling CSS to allow
// *both* importing CSS inline from scripts while
// still bundling entrypoints to their respective files
const ctxStyles = await esbuild.context({
  outdir: "./public/dist/styles",
  entryPoints: cssEntrypoints,
  loader: {
    // When referencing an external file in CSS,
    // bundle that file and replace the string
    // with the bundled file location.
    ".woff2": "file",
  },
  ...baseOptions,
});

const ctxScripts = await esbuild.context({
  outdir: "./public/dist/scripts",
  entryPoints: jsEntrypoints,
  loader: {
    // Allow importing HTML/CSS files as text in JavaScript:
    // import html from './index.html'
    // import styles from './index.css'
    ".html": "text",
    ".css": "text",
  },
  ...baseOptions,
});

// Clean the output directory first
rmSync("./public/dist", { recursive: true, force: true });

if (watch) {
  console.log("Watching for changes");
  await ctxStyles.watch();
  await ctxScripts.watch();
} else {
  console.log("Doing a one-shot build");

  await ctxStyles.rebuild();
  await ctxStyles.dispose();

  await ctxScripts.rebuild();
  await ctxScripts.dispose();

  console.log("Build complete");
}
