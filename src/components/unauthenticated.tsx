import { Snippet } from "@nextui-org/snippet";

import { siteConfig } from "@/config/site";
import { title } from "@/components/primitives";

export const UnAuthenticated = () => {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-lg text-center justify-center">
        <h1 className={title({ color: "violet", size: "lg" })}>
          {siteConfig.name}
        </h1>
        <div className="mt-8">
          <Snippet hideCopyButton hideSymbol variant="flat">
            Not Authenticated
          </Snippet>
        </div>
      </div>
    </section>
  );
};
