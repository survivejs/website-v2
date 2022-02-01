import trimStart from "https://deno.land/x/lodash@4.17.15-es/trimStart.js";

function cleanSlug(resourcePath: string) {
  const parts = resourcePath.split("/");
  const end =
    trimStart(parts.slice(-1)[0], "0123456789-_", undefined).split(".")[0];

  return end.toLowerCase()
    .replace(/ /g, "-")
    .replace(/_/g, "-");
}

export default cleanSlug;
