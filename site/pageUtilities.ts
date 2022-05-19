import images from "../.images.json" assert { type: "json" };

// This function allows resolving image paths to Cloudflare ids
// so that you don't have to use ids at templates.
function resolveImage(input: string) {
  // @ts-expect-error Error is expected as headerImage isn't strict enough and
  // we validate it in runtime.
  return images[input];
}

export { resolveImage };
