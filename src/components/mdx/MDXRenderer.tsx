import type {
  MDXComponents,
  EvaluateOptions,
} from "next-mdx-remote-client/rsc";

import { evaluate } from "next-mdx-remote-client/rsc";

import { MdxRendererProps } from "@/interfaces/mdx";

import LoadDynamicImage from "./LoadDynamicImage";
import Callout from "./Callout";
import Snippet from "./Snippet";
import Quote from "./Quote";
import TableOfContentsMdx from "./TableOfContentsMdx";

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
