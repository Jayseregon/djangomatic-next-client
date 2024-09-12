import type { Metadata } from "next";

// import { unstable_setRequestLocale } from "next-intl/server";
import { title } from "@/src/components/primitives";
import { docsVistabeam } from "#site/content";
import MDXContent from "@/src/components/mdx/MDXRenderer";
import { UnAuthenticated } from "@/components/auth/unAuthenticated";
import { auth } from "@/auth";
import { WithPermissionOverlayDocs } from "@/src/components/auth/withPermissionOverlay";

interface MdPageProps {
  params: {
    slug: string;
  };
  session?: any;
}

export default async function MdPage({ params }: { params: { slug: string } }) {
  const session = await auth();

  if (!session) return <UnAuthenticated />;

  return <MdPageContent params={params} session={session} />;
}

function MdPageContent({ params, session }: MdPageProps) {
  //   params: { locale, slug },
  // }: {
  //   params: { locale: string; slug: string };
  // }) {

  // unstable_setRequestLocale(locale);
  const doc = getPageBySlug(params.slug);

  if (!doc) {
    return (
      <WithPermissionOverlayDocs
        email={session.user.email}
        permission="canAccessDocsVistabeam"
      >
        <div>
          <h1 className={title()}>Future doc for </h1>
          <div className="py-3" />
          <h2 className="font-light text-4xl italic">{params.slug}</h2>
        </div>
      </WithPermissionOverlayDocs>
    );
  }

  return (
    <WithPermissionOverlayDocs
      email={session.user.email}
      permission="canAccessDocsVistabeam"
    >
      <div>
        <h1 className={title()}>{doc.title}</h1>

        <div className="py-3" />

        <div className="prose prose-lightTheme dark:prose-darkTheme text-justify max-w-screen-md mx-auto">
          <MDXContent code={doc.body} />
        </div>
      </div>
    </WithPermissionOverlayDocs>
  );
}

function getPageBySlug(slug: string) {
  return docsVistabeam.find((doc) => doc.slug === slug);
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const doc = getPageBySlug(params.slug);

  if (doc == null) return {};

  return { title: doc.title };
}

export function generateStaticParams(): { params: { slug: string } }[] {
  return docsVistabeam.map((doc) => ({ params: { slug: doc.slug } }));
}
