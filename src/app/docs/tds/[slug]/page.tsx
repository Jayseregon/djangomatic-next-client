import { auth } from "@/auth";
import { UnAuthenticated } from "@/components/auth/unAuthenticated";
import { MdPageContentProps } from "@/interfaces/mdx";
import DynamicDocTemplate, {
  generateMetadataTemplate,
  generateStaticParamsTemplate,
} from "@/components/mdx/DynamicDocTemplate";

const docType = "tds";

export default async function MdPage({ params }: { params: { slug: string } }) {
  const session = await auth();

  if (!session) return <UnAuthenticated />;

  return <MdPageContent params={params} session={session} />;
}

function MdPageContent({ params, session }: MdPageContentProps) {
  return (
    <DynamicDocTemplate
      docType={docType}
      params={params}
      permission="canAccessDocsTDS"
      session={session}
    />
  );
}

export const generateMetadata = (props: { params: { slug: string } }) =>
  generateMetadataTemplate({ ...props, docType: docType });

export const generateStaticParams = () => generateStaticParamsTemplate(docType);
