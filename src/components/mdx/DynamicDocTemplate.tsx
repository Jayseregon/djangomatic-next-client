import fs from "fs";

import { Metadata } from "next";
import { Suspense } from "react";

import { WithPermissionOverlayDocs } from "@/src/components/auth/withPermissionOverlay";
import { title } from "@/src/components/primitives";
import { LoadingContent } from "@/components/ui/LoadingContent";
import { MDXRenderer } from "@/components/mdx/MDXRenderer";
import {
  DynamicDocTemplateProps,
  MetadataTemplateProps,
} from "@/interfaces/mdx";
import { docsDirectory, getDocContent } from "@/src/lib/mdxUtils";

export default async function DynamicDocTemplate({
  slug,
  docType,
  permission,
  session,
}: DynamicDocTemplateProps) {
  const source = await getDocContent(docType, slug);
  const { content, frontmatter } = await MDXRenderer({ source });

  return (
    <WithPermissionOverlayDocs
      email={session.user.email}
      permission={permission}
    >
      <div>
        <h1 className={title()}>{frontmatter.title as string}</h1>
        <div className="py-3" />
        <div className="prose prose-lightTheme dark:prose-darkTheme text-justify max-w-screen-md mx-auto">
          <Suspense fallback={<LoadingContent />}>{content}</Suspense>
        </div>
      </div>
    </WithPermissionOverlayDocs>
  );
}

// Update metadata dynamically based on frontmatter
export async function generateMetadataTemplate({
  slug,
  docType,
}: MetadataTemplateProps): Promise<Metadata> {
  const source = await getDocContent(docType, slug);
  const { frontmatter } = await MDXRenderer({ source });

  return { title: frontmatter.title as string };
}

export async function generateStaticParamsTemplate(docType: string) {
  const files = fs.readdirSync(docsDirectory(docType));

  return files
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => ({ slug: file.replace(/\.mdx$/, "") }));
}
