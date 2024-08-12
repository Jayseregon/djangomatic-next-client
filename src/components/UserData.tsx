import { Snippet } from "@nextui-org/snippet";
import { auth } from "@/auth";

// export async function UserData() {
//     const session = await auth();

//     if (!session) return <div>Not authenticated</div>;

//     return (
//       <div className="text-start">
//         <Snippet hideCopyButton hideSymbol variant="flat">
//           <pre>{JSON.stringify(session, null, 2)}</pre>
//         </Snippet>
//       </div>
//     );
//   }

export function UserData({ session }: { session: any }) {
  return (
    <div className="text-start">
      <Snippet
        hideCopyButton
        hideSymbol
        variant="flat">
        <pre>{JSON.stringify(session, null, 2)}</pre>
      </Snippet>
    </div>
  );
}
