import { redirect } from "next/navigation";
// import { headers } from "next/headers";
import { Button } from "@nextui-org/react";

import { siteConfig } from "@/config/site";
import { title } from "@/components/primitives";
import { signIn, auth, providerMap } from "@/auth";
import { Logo } from "@/src/components/icons";

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

        <div className="inline-block max-w-screen justify-center my-5">
          <h1 className={title({ color: "violet", size: "lg" })}>
            {process.env.APP_ENV !== "production"
              ? siteConfig.nameDev
              : siteConfig.name}
          </h1>
        </div>

        <div className="inline-block justify-center">
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
            <Button
              className="bg-gradient-to-tr from-[#b249f8] to-[#01cfea] text-white shadow-lg"
              radius="full"
              type="submit"
            >
              <span>
                Sign in with{" "}
                {provider.name === "Microsoft Entra ID" ? "SSO" : provider.name}
              </span>
            </Button>
          </form>
        ))}
      </div>
    </div>
  );
}
