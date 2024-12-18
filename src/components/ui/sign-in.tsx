import type { JSX } from "react";

import { signIn, signOut } from "next-auth/react";

/**
 * SignIn component renders a button to sign in using GitHub.
 *
 * @param {Object} props - The props for the SignIn component.
 * @param {string} props.buttonName - The name to be displayed on the button.
 * @returns {JSX.Element} The rendered SignIn component.
 */
export function SignIn({ buttonName }: { buttonName: string }): JSX.Element {
  return <button onClick={() => signIn("github")}>{buttonName}</button>;
}

/**
 * SignOut component renders a button to sign out.
 *
 * @param {Object} props - The props for the SignOut component.
 * @param {string} props.buttonName - The name to be displayed on the button.
 * @returns {JSX.Element} The rendered SignOut component.
 */
export function SignOut({ buttonName }: { buttonName: string }): JSX.Element {
  return <button onClick={() => signOut()}>{buttonName}</button>;
}
