import type {
  MDXComponents,
  EvaluateOptions,
} from "next-mdx-remote-client/rsc";

import { evaluate } from "next-mdx-remote-client/rsc";

import { MdxRendererProps } from "@/interfaces/mdx";
import Callout from "@/components/mdx/Callout";
import Snippet from "@/components/mdx/Snippet";
import LoadDynamicImage from "@/components/mdx/LoadDynamicImage";
import Quote from "@/components/mdx/Quote";
import TableOfContentsMdx from "@/components/mdx/TableOfContentsMdx";

const sharedComponents: MDXComponents = {
  Callout,
  Snippet,
  LoadDynamicImage,
  Quote,
  TableOfContentsMdx,
};

export async function MDXRenderer({ source }: MdxRendererProps) {
  const options: EvaluateOptions = {
    parseFrontmatter: true,
  };

  // Evaluate the MDX content
  const { content, frontmatter, error } = await evaluate({
    source,
    options,
    components: sharedComponents,
  });

  if (error) {
    throw new Error(`Error loading content: ${error.message}`);
  }

  return { content, frontmatter };
}
