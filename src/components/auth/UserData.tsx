import type { JSX } from "react";

import { Snippet } from "@heroui/snippet";

/**
 * UserData component renders user session data in a formatted JSON snippet.
 *
 * @param {Object} props - The props for the UserData component.
 * @param {any} props.session - The session object containing user information.
 * @returns {JSX.Element} The rendered UserData component.
 */
export function UserData({ session }: { session: any }): JSX.Element {
  return (
    <div className="text-start">
      <Snippet hideCopyButton hideSymbol variant="flat">
        <pre>{JSON.stringify(session, null, 2)}</pre>
      </Snippet>
    </div>
  );
}
