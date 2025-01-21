import type { JSX } from "react";

import { Snippet } from "@heroui/snippet";

import { siteConfig } from "@/config/site";
import { title } from "@/components/primitives";

/**
 * UnAuthenticated component displays a message indicating that the user is not authenticated.
 *
 * @returns {JSX.Element} The rendered UnAuthenticated component.
 */
export const UnAuthenticated = (): JSX.Element => {
  return (
    <section
      className="flex flex-col items-center justify-center gap-4 py-8 md:py-10"
      data-testid="unauthenticated"
    >
      <div className="inline-block max-w-lg text-center justify-center">
        {/* Display the site name */}
        <h1 className={title({ color: "violet", size: "lg" })}>
          {siteConfig.name}
        </h1>
        <div className="mt-8">
          {/* Display a snippet indicating that the user is not authenticated */}
          <Snippet hideCopyButton hideSymbol variant="flat">
            Not Authenticated
          </Snippet>
        </div>
      </div>
    </section>
  );
};
