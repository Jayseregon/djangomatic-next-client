import type { JSX } from "react";

import { Spinner } from "@nextui-org/react";

export const LoadingContent = (): JSX.Element => {
  return (
    <div className="flex flex-col items-center justify-center pt-24">
      <Spinner color="primary" label="Loading..." />
    </div>
  );
};
