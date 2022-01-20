import * as path from "https://deno.land/std@0.113.0/path/mod.ts";
import { parse } from "https://deno.land/x/frontmatter/mod.ts";
import cloneDeep from "https://deno.land/x/lodash@4.17.15-es/cloneDeep.js";
import trimStart from "https://deno.land/x/lodash@4.17.15-es/trimStart.js";
import removeMarkdown from "https://esm.sh/remove-markdown@0.3.0";
import config from "../../.config.json" assert { type: "json" };
import images from "../../.images.json" assert { type: "json" };

type MarkdownWithFrontmatter = {
  content: string;
  data: {
    description: string;
    preview: string;
    headerImage: string;
    slug: string;
    title: string;
    date: Date;
    keywords: string[];
  };
};

async function indexMarkdown(directory: string) {
  const files = await dir(directory, ".md");

  files.sort((a, b) => getIndex(b.name) - getIndex(a.name));

  const ret = await Promise.all(
    files.map(({ path }) =>
      Deno.readTextFile(path).then(
        (d) => {
          const p = parse(d) as {
            content: string;
            data: Record<string, unknown> & {
              description?: string;
              preview?: string;
              headerImage?: string;
            };
          };
          const preview = generatePreview(p.content, 150);

          return {
            ...p,
            data: {
              ...p.data,
              description: p.data?.description || p.data?.preview || preview,
              headerImage: resolveHeaderImage(p.data?.headerImage),
              slug: cleanSlug(path),
              preview,
            },
          } as MarkdownWithFrontmatter;
        },
      )
    ),
  );

  return generateAdjacent(ret);
}

function resolveHeaderImage(headerImage?: string) {
  if (!headerImage) {
    return "";
  }

  // @ts-expect-error Error is expected as headerImage isn't strict enough and
  // we validate it in runtime.
  const image = images[headerImage];
  if (!image) {
    throw new Error("Failed to find a matching image for " + headerImage);
  }

  return config.imagesEndpoint + image + "/public";
}

function getIndex(str: string) {
  return parseInt(str.split("-")[0], 10);
}

async function dir(p: string, extension?: string) {
  const ret = [];

  for await (const { name } of Deno.readDir(p)) {
    if (extension) {
      if (path.extname(name) === extension) {
        ret.push({ path: path.join(p, name), name });
      }
    } else {
      ret.push({ path: path.join(p, name), name });
    }
  }

  return ret;
}

function cleanSlug(resourcePath: string) {
  const parts = resourcePath.split("/");
  const end =
    trimStart(parts.slice(-1)[0], "0123456789-_", undefined).split(".")[0];

  return end.toLowerCase()
    .replace(/ /g, "-")
    .replace(/_/g, "-");
}

function generateAdjacent(pages: unknown[]) {
  return pages.map((page, i) => {
    const ret = cloneDeep(page); // Avoid mutation

    ret.previous = i > 0 && pages[i - 1];
    ret.next = i < pages.length - 1 && pages[i + 1];

    return ret;
  });
}

function generatePreview(content: string, amount: number) {
  return `${removeMarkdown(content).slice(0, amount)}…`;
}

export default indexMarkdown;
