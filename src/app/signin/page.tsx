import type { JSX } from "react";

import { redirect } from "next/navigation";
// import { headers } from "next/headers";
// import { Button } from "@heroui/react";

import { title } from "@/components/primitives";
import { signIn, auth, providerMap } from "@/auth";
import { Logo } from "@/src/components/icons";
import AppName from "@/src/components/ui/AppName";

/**
 * SignInPage component renders the sign-in page.
 * It checks if the user is already authenticated and redirects to the home page if they are.
 * If not authenticated, it displays the sign-in options for various providers.
 *
 * @returns {JSX.Element} The rendered SignInPage component.
 */
export default async function SignInPage(): Promise<JSX.Element> {
  // const nonce = headers().get("x-nonce");
  const session = await auth();

  if (session) {
    redirect("/");
  }

  return (
    <div className="flex flex-col justify-between max-h-screen">
      <div className="flex flex-col items-center justify-center flex-grow gap-2">
        <Logo size={100} />

        <div className="inline-block max-w-screen my-5">
          <AppName />
        </div>

        <div className="inline-block">
          <h2 className={title({ color: "cyan", size: "md" })}>
            Please sign in to continue.
          </h2>
        </div>

        <div className="my-10" />

        {Object.values(providerMap).map((provider) => (
          <form
            key={provider.id}
            action={async () => {
              "use server";
              try {
                await signIn(provider.id);
              } catch (error) {
                throw error;
              }
            }}
          >
            <button
              className="bg-gradient-to-tr from-[#b249f8] to-[#01cfea] text-white shadow-lg rounded-full px-4 py-2"
              type="submit"
            >
              {provider.name === "Microsoft Entra ID"
                ? "Sign in with SSO"
                : `Sign in with ${provider.name}`}
            </button>
          </form>
        ))}
      </div>
    </div>
  );
}
