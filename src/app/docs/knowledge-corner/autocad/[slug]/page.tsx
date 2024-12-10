import { auth } from "@/auth";
import { UnAuthenticated } from "@/components/auth/unAuthenticated";
import DynamicDocTemplate, {
  generateMetadataTemplate,
  generateStaticParamsTemplate,
} from "@/components/mdx/DynamicDocTemplate";

const docType = "knowledge-corner";

export default async function MdPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const session = await auth();
  const { slug } = await props.params;

  if (!session) return <UnAuthenticated />;

  return (
    <DynamicDocTemplate
      docType={docType}
      permission="canAccessDocsComcast"
      session={session}
      slug={slug}
    />
  );
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;

  return generateMetadataTemplate({ slug: slug, docType: docType });
}

export const generateStaticParams = () => generateStaticParamsTemplate(docType);
