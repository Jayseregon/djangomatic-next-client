import { setRequestLocale } from "next-intl/server";

import { SidebarDocs } from "@/src/components/ui/sidebars/SidebarDocs";
import { SearchInput } from "@/src/components/ui/SearchInput";

export default async function DocsLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const params = await props.params;
  const { locale } = params;
  const { children } = props;

  setRequestLocale(locale);

  return (
    <div className="flex min-h-screen">
      <div className="w-72 fixed inset-y-0 left-0 mt-20 ms-4 mb-12">
        <SearchInput alwaysExpanded={true} />
      </div>
      <div className="w-72 fixed inset-y-0 left-0 mt-32 ms-4 mb-12 overflow-y-auto">
        <SidebarDocs />
      </div>
      <section className="flex-grow ml-72 flex flex-col items-center gap-4 py-8 md:py-10 overflow-y-auto">
        <div className="inline-block max-w-full text-center justify-center">
          {children}
        </div>
      </section>
    </div>
  );
}
