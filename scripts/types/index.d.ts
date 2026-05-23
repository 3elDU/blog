// HTML imported as string (processed with esbuild)
declare module "*.html" {
  const value: string;
  export default value;
}

// CSS imported as string, processed with esbuild
declare module "*.css" {
  const value: string;
  export default value;
}
