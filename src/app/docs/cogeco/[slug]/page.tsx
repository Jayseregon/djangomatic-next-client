import { auth } from "@/auth";
import { UnAuthenticated } from "@/components/auth/unAuthenticated";
import { MdPageContentProps } from "@/interfaces/mdx";
import DynamicDocTemplate, {
  generateMetadataTemplate,
  generateStaticParamsTemplate,
} from "@/components/mdx/DynamicDocTemplate";

export default async function MdPage({ params }: { params: { slug: string } }) {
  const session = await auth();

  if (!session) return <UnAuthenticated />;

  return <MdPageContent params={params} session={session} />;
}

function MdPageContent({ params, session }: MdPageContentProps) {
  return (
    <DynamicDocTemplate
      docType="cogeco"
      params={params}
      permission="canAccessDocsCogeco"
      session={session}
    />
  );
}

export const generateMetadata = (props: { params: { slug: string } }) =>
  generateMetadataTemplate({ ...props, docType: "tds" });

export const generateStaticParams = () => generateStaticParamsTemplate("tds");
