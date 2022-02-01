import { parse } from "https://deno.land/x/frontmatter/mod.ts";
import cloneDeep from "https://deno.land/x/lodash@4.17.15-es/cloneDeep.js";
import removeMarkdown from "https://esm.sh/remove-markdown@0.3.0";
import dir from "../utils/dir.ts";
import resolveKeywordToTitle from "../utils/resolve-keyword-to-title.ts";
import cleanSlug from "../utils/clean-slug.ts";
import config from "../../.config.json" assert { type: "json" };
import images from "../../.images.json" assert { type: "json" };
import type {
  MarkdownWithFrontmatterInput,
  MarkdownWithFrontmatterResult,
} from "../types.ts";

async function indexMarkdown(directory: string) {
  const files = await dir(directory, ".md");

  files.sort((a, b) => getIndex(b.name) - getIndex(a.name));

  const ret = await Promise.all(
    files.map(({ path }) =>
      Deno.readTextFile(path).then(
        (d) => {
          const p = parse(d) as MarkdownWithFrontmatterInput;
          const preview = generatePreview(p.content, 150);

          return {
            ...p,
            data: {
              ...p.data,
              description: p.data?.description || p.data?.preview || preview,
              images: resolveImages(p.data?.headerImage),
              slug: cleanSlug(path),
              preview,
              author: p.data?.author || {
                name: "Juho Vepsäläinen",
                twitter: "https://twitter.com/bebraw",
              },
              topics: p.data?.keywords?.map((keyword) => {
                return {
                  title: resolveKeywordToTitle(keyword),
                  slug: keyword,
                };
              }) || [],
            },
          } as MarkdownWithFrontmatterResult;
        },
      )
    ),
  );

  return generateAdjacent(ret);
}

function resolveImages(headerImage?: string) {
  if (!headerImage) {
    return "";
  }

  // @ts-expect-error Error is expected as headerImage isn't strict enough and
  // we validate it in runtime.
  const image = images[headerImage];
  if (!image) {
    throw new Error("Failed to find a matching image for " + headerImage);
  }

  return {
    header: config.imagesEndpoint + `?image=${image}&type=public`,
    thumbnail: config.imagesEndpoint + `?image=${image}&type=thumb`,
  };
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

function generatePreview(content: string, amount: number) {
  return `${removeMarkdown(content).slice(0, amount)}…`;
}

export default indexMarkdown;
