import { parse } from "https://deno.land/x/frontmatter/mod.ts";
import dir from "../utils/dir.ts";
import cleanSlug from "../utils/clean-slug.ts";
import resolveBlogPost from "../utils/resolve-blog-post.ts";
import resolveKeywordToTitle from "../utils/resolve-keyword-to-title.ts";
import type {
  MarkdownWithFrontmatterInput,
  MarkdownWithFrontmatterResult,
} from "../types.ts";

async function indexTopics(directory: string) {
  const files = await dir(directory, ".md");
  const keywords: Record<string, MarkdownWithFrontmatterResult[]> = {};

  files.sort((a, b) => getIndex(b.name) - getIndex(a.name));

  await Promise.all(
    files.map(({ path }) =>
      Deno.readTextFile(path).then(
        (d) => {
          const p = parse(d) as MarkdownWithFrontmatterInput;

          p.data.keywords?.forEach((keyword) => {
            if (keywords[keyword]) {
              keywords[keyword].push({ ...p, data: resolveBlogPost(path, p) });
            } else {
              keywords[keyword] = [{ ...p, data: resolveBlogPost(path, p) }];
            }
          });
        },
      )
    ),
  );

  const keywordsArray = Object.keys(keywords);

  keywordsArray.sort();

  return keywordsArray.map((topic) => {
    return {
      title: resolveKeywordToTitle(topic),
      posts: keywords[topic],
      slug: cleanSlug(topic),
    };
  });
}

function getIndex(str: string) {
  return parseInt(str.split("-")[0], 10);
}

export default indexTopics;
