import type { JSX } from "react";

import { Spinner } from "@heroui/react";

export const LoadingContent = (): JSX.Element => {
  return (
    <div
      className="flex flex-col items-center justify-center pt-24"
      data-testid="loading-spinner-wrapper"
    >
      <Spinner
        color="primary"
        data-testid="loading-spinner"
        label="Loading..."
      />
    </div>
  );
};
