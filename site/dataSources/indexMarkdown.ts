import { parse } from "https://deno.land/x/frontmatter/mod.ts";
import cloneDeep from "https://deno.land/x/lodash@4.17.15-es/cloneDeep.js";
import dir from "../utils/dir.ts";
import resolveBlogPost from "../utils/resolve-blog-post.ts";
import type { MarkdownWithFrontmatterInput } from "../types.ts";

async function indexMarkdown(directory: string) {
  const files = await dir(directory, ".md");

  files.sort((a, b) => getIndex(b.name) - getIndex(a.name));

  const ret = await Promise.all(
    files.map(({ path }) =>
      Deno.readTextFile(path).then(
        (d) => {
          const p = parse(d) as MarkdownWithFrontmatterInput;

          return {
            ...p,
            data: resolveBlogPost(path, p),
          };
        },
      )
    ),
  );

  return generateAdjacent(ret);
}

function getIndex(str: string) {
  return parseInt(str.split("-")[0], 10);
}

function generateAdjacent(pages: unknown[]) {
  return pages.map((page, i) => {
    const ret = cloneDeep(page); // Avoid mutation

    ret.next = i > 0 && pages[i - 1];
    ret.previous = i < pages.length - 1 && pages[i + 1];

    return ret;
  });
}

export default indexMarkdown;
