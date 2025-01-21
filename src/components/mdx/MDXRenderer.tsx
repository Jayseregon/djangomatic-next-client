import type {
  MDXComponents,
  EvaluateOptions,
} from "next-mdx-remote-client/rsc";

import { evaluate } from "next-mdx-remote-client/rsc";

import { MdxRendererProps } from "@/interfaces/mdx";
import Callout from "@/components/mdx/callout";
import Snippet from "@/components/mdx/snippet";
import LoadDynamicImage from "@/components/mdx/LoadDynamicImage";
import Quote from "@/components/mdx/quote";
import TableOfContentsMdx from "@/components/mdx/TableOfContentsMdx";
import { BugReportNotice } from "@/components/root/BugReportNotice";

const sharedComponents: MDXComponents = {
  Callout,
  Snippet,
  LoadDynamicImage,
  Quote,
  TableOfContentsMdx,
  BugReportNotice,
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
