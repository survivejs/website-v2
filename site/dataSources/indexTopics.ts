import { parse } from "https://deno.land/x/frontmatter/mod.ts";
import dir from "../utils/dir.ts";
import resolveKeywordToTitle from "../utils/resolve-keyword-to-title.ts";
import type { MarkdownWithFrontmatterInput } from "../types.ts";

async function indexMarkdown(directory: string) {
  const files = await dir(directory, ".md");
  const keywords: Record<string, number> = {};

  files.sort((a, b) => getIndex(b.name) - getIndex(a.name));

  await Promise.all(
    files.map(({ path }) =>
      Deno.readTextFile(path).then(
        (d) => {
          const p = parse(d) as MarkdownWithFrontmatterInput;

          p.data.keywords?.forEach((keyword) => {
            if (keywords[keyword]) {
              keywords[keyword]++;
            } else {
              keywords[keyword] = 1;
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
      count: keywords[topic],
      slug: topic,
    };
  });
}

function getIndex(str: string) {
  return parseInt(str.split("-")[0], 10);
}

export default indexMarkdown;
