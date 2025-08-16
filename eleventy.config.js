import * as esbuild from "esbuild";
import { bundle } from "lightningcss";

const cssEntrypoints = [
  "./styles/index.css",
  // Also bundle everything not inside ./styles/
  /^\.(?!\/styles\/)[a-zA-Z-/]+.css$/,
];

const jsEntrypoints = [
  // Bundle verything inside ./scripts, but not ./scripts/lib
  // (those are library files not meant to be entrypoints)
  /^\.\/scripts\/(?!lib)[a-zA-Z-/]+.(js|ts)$/,
];

/** @param {import("@11ty/eleventy").UserConfig} eleventyConfig */
export default async function (eleventyConfig) {
  eleventyConfig.setLayoutsDirectory("layouts");
  eleventyConfig.setIncludesDirectory("components");
  eleventyConfig.addPassthroughCopy("fonts");
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.setOutputDirectory("dist");

  /** Filter to format date as "Month Year", for example "February 2025" */
  eleventyConfig.addFilter(
    "formatDate",
    /** @param {Date} value */
    function (value) {
      const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

      return `${months[value.getUTCMonth()]} ${value.getUTCFullYear()}`;
    }
  );

  /** Auto reload when CSS files change */
  eleventyConfig.addWatchTarget("./styles");

  /** CSS bundling */
  eleventyConfig.addTemplateFormats("css");
  eleventyConfig.addExtension("css", {
    outputFileExtension: "css",
    read: false,
    /**
     * @param {string} content
     * @param {string} path
     */
    compile: async (_, path) => {
      for (const entrypoint of cssEntrypoints) {
        if (typeof entrypoint == "string" && path != entrypoint) continue;
        else if (entrypoint instanceof RegExp && !entrypoint.test(path))
          continue;

        const result = bundle({
          filename: path,
          minify: true,
        });

        return async () => {
          return result.code.toString();
        };
      }
    },
  });

  eleventyConfig.addTemplateFormats("ts");
  eleventyConfig.addExtension("ts", {
    outputFileExtension: "js",
    read: false,
    /**
     * @param {string} path
     * @returns
     */
    compile: async (_, path) => {
      for (const entrypoint of jsEntrypoints) {
        if (typeof entrypoint == "string" && path != entrypoint) continue;
        else if (entrypoint instanceof RegExp && !entrypoint.test(path))
          continue;

        const result = await esbuild.build({
          entryPoints: [path],
          bundle: true,
          write: false,
          minify: true,
        });

        return async () => {
          return result.outputFiles?.at(0)?.text;
        };
      }
    },
  });
}

export const config = {
  markdownTemplateEngine: "njk",
  htmlTemplateEngine: "njk",
};
