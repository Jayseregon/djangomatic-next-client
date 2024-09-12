import { headers } from "next/headers";
import { unstable_setRequestLocale } from "next-intl/server";

import { SidebarDocs } from "@/src/components/ui/sidebars";
import { SearchInput } from "@/src/components/ui/SearchInput";

export default function DocsLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const nonce = headers().get("x-nonce");

  unstable_setRequestLocale(locale);

  return (
    <div className="flex min-h-screen">
      <div className="w-72 fixed inset-y-0 left-0 mt-20 ms-4 mb-12">
        <SearchInput alwaysExpanded={true} />
      </div>
      <div className="w-72 fixed inset-y-0 left-0 mt-32 ms-4 mb-12 overflow-y-auto">
        <SidebarDocs nonce={nonce || undefined} />
      </div>
      <section className="flex-grow ml-72 flex flex-col items-center overflow-y-auto">
        <div className="inline-block max-w-full text-center">{children}</div>
      </section>
    </div>
  );
}
