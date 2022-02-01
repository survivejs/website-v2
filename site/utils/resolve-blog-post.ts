import removeMarkdown from "https://esm.sh/remove-markdown@0.3.0";
import resolveKeywordToTitle from "./resolve-keyword-to-title.ts";
import cleanSlug from "./clean-slug.ts";
import config from "../../.config.json" assert { type: "json" };
import images from "../../.images.json" assert { type: "json" };
import type { MarkdownWithFrontmatterInput } from "../types.ts";

function resolveBlogPost(path: string, p: MarkdownWithFrontmatterInput) {
  const preview = generatePreview(p.content, 150);

  return {
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
  };
}

function resolveImages(headerImage?: string) {
  if (!headerImage) {
    return { header: "", thumbnail: "" };
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

function generatePreview(content: string, amount: number) {
  return `${removeMarkdown(content).slice(0, amount)}…`;
}

export default resolveBlogPost;
