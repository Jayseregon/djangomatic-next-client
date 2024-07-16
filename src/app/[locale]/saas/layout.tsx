import { SidebarSaas } from "@/src/components/sidebars";
import { headers } from "next/headers";
import SearchInput from "@/src/components/SearchInput";

export default function SaasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const nonce = headers().get("x-nonce");

  return (
    <div className="flex min-h-screen">
      <div className="w-64 fixed inset-y-0 left-0 mt-20 ms-4 mb-12">
        <SearchInput alwaysExpanded={true} />
      </div>
      <div className="w-64 fixed inset-y-0 left-0 mt-32 ms-4 mb-12 border-r border-slate-300 dark:border-slate-700 overflow-y-auto">
        <SidebarSaas nonce={nonce || undefined} />
      </div>
      <section className="flex-grow ml-64 flex flex-col items-center overflow-y-auto">
        <div className="inline-block max-w-fit text-center justify-center">
          {children}
        </div>
      </section>
    </div>
  );
}
