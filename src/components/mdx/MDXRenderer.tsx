import type {
  MDXComponents,
  EvaluateOptions,
} from "next-mdx-remote-client/rsc";

import { evaluate } from "next-mdx-remote-client/rsc";

import { MdxRendererProps } from "@/interfaces/mdx";
import LoadDynamicImage from "@/components/mdx/LoadDynamicImage";
import TableOfContentsMdx from "@/components/mdx/TableOfContentsMdx";
import { BugReportNotice } from "@/components/root/BugReportNotice";
import Callout from "@/src/components/mdx/callout";
import Snippet from "@/src/components/mdx/snippet";
import Quote from "@/src/components/mdx/quote";
import DownloadLinkedFile from "@/src/components/mdx/DownloadLinkedFile";

const sharedComponents: MDXComponents = {
  Callout,
  Snippet,
  LoadDynamicImage,
  Quote,
  TableOfContentsMdx,
  BugReportNotice,
  DownloadLinkedFile,
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
