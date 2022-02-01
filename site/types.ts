type MarkdownWithFrontmatter = {
  content: string;
  data: Record<string, unknown> & {
    description?: string;
    preview?: string;
    author?: {
      name: string;
      twitter: string;
    };
  };
};

type MarkdownWithFrontmatterInput = MarkdownWithFrontmatter & {
  data: Record<string, unknown> & {
    headerImage?: string;
    keywords?: string[];
  };
};

type MarkdownWithFrontmatterResult = {
  data: Record<string, unknown> & {
    images?: {
      header: string;
      thumbnail: string;
    };
  };
};

export type { MarkdownWithFrontmatterInput, MarkdownWithFrontmatterResult };
