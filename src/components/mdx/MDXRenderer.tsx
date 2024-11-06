import type {
  MDXComponents,
  EvaluateOptions,
} from "next-mdx-remote-client/rsc";

import { evaluate } from "next-mdx-remote-client/rsc";

import { MdxRendererProps } from "@/interfaces/mdx";

import Callout from "./callout";
import Snippet from "./snippet";
import { LoadDynamicImage } from "./loadImages";
import Quote from "./quote";

const sharedComponents: MDXComponents = {
  Callout,
  Snippet,
  LoadDynamicImage,
  Quote,
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
