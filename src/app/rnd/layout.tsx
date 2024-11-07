import { headers } from "next/headers";
import { auth } from "@/auth";
import { UnAuthenticated } from "@/components/auth/unAuthenticated";

import { SearchInput } from "@/components/ui/SearchInput";
import { SidebarRnD } from "@/components/ui/sidebars/SidebarRnD";
import { fetchUser } from "@/lib/getUserPermission";
import { UserAccessRnDLayout } from "@/components/rnd/UserAccess";

export default async function RnDLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const nonce = headers().get("x-nonce") || "";
  const session = await auth();

  if (!session) {
    return <UnAuthenticated />;
  }
  return (
    <div className="flex min-h-screen">
      <div className="w-72 fixed inset-y-0 left-0 mt-20 ms-4 mb-12">
        <SearchInput alwaysExpanded={true} />
      </div>
      <div className="w-72 fixed inset-y-0 left-0 mt-32 ms-4 mb-12 overflow-y-auto">
        <SidebarRnD
          nonce={nonce}
          email={session.user.email as string}
        />
      </div>
      <section className="flex-grow ml-72 flex flex-col items-center gap-4 py-8 md:py-10 overflow-y-auto">
        <div className="inline-block max-w-fit px-5 text-center justify-center">
          {children}
        </div>
      </section>
    </div>
  );
}
