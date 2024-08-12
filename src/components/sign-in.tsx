import { signIn, signOut } from "next-auth/react";

export function SignIn({ buttonName }: { buttonName: string }) {
  return <button onClick={() => signIn("github")}>{buttonName}</button>;
}

export function SignOut({ buttonName }: { buttonName: string }) {
  return <button onClick={() => signOut()}>{buttonName}</button>;
}
