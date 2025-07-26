import * as esbuild from "esbuild";
import { bundle } from "lightningcss";

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
      // In ./styles/ and all of it's subdirectories, only handle index.css,
      // because we're well, bundling CSS.
      // If the style originates not from ./styles directory, bundle it separately, to allow page-specific styles
      if (path.startsWith("./styles/") && path !== "./styles/index.css") {
        return;
      }

      const result = bundle({
        filename: path,
        minify: true,
      });

      return async () => {
        return result.code.toString();
      };
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
      // Bundle everything in ./scripts folder, but do not bundle library files as individual entrypoints
      if (path.startsWith("./scripts") && !path.startsWith("./scripts/lib")) {
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
