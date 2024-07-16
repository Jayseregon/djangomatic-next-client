// import { useTranslations } from "next-intl";
import type { Metadata } from "next";

// import { headers } from "next/headers";

import { title } from "@/src/components/primitives";
import { docs } from "#site/content";
import MDXContent from "@/src/components/MDXRenderer";

interface Props {
  params: {
    slug: string;
  };
}

function getPageBySlug(slug: string) {
  return docs.find((doc) => doc.slug === slug);
}

export default function MdPage({ params }: Props) {
  // const t = useTranslations("About");
  // const nonce = headers().get("x-nonce");
  const doc = getPageBySlug(params.slug);

  if (!doc) {
    return (
      <div>
        <h1 className={title()}>Future doc for </h1>
        <div className="py-3" />
        <h2 className="font-light text-4xl italic">{params.slug}</h2>
      </div>
    );
  }

  return (
    <div>
      <h1 className={title()}>{doc.title}</h1>
      <div className="py-3" />

      <div className="prose prose-lightTheme dark:prose-darkTheme text-justify max-w-screen-md mx-auto">
        <MDXContent code={doc.body} />
      </div>
    </div>
  );
}

export function generateMetadata({ params }: Props): Metadata {
  const doc = getPageBySlug(params.slug);

  if (doc == null) return {};

  return { title: doc.title };
}

export function generateStaticParams(): Props["params"][] {
  return docs.map((doc) => ({ slug: doc.slug }));
}
