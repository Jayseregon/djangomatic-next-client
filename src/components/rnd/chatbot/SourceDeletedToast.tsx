import * as Toast from "@radix-ui/react-toast";
import { CircleCheck, CircleX, AlertCircle } from "lucide-react";
import { useTheme } from "next-themes";

import { ChromaDeleteSourceResponse } from "@/interfaces/chatbot";

interface SourceDeletedToastProps {
  response: ChromaDeleteSourceResponse;
  collectionName: string;
  sourceName: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  isError?: boolean;
}

const SourceDeletedToast: React.FC<SourceDeletedToastProps> = ({
  response,
  collectionName,
  sourceName,
  open,
  setOpen,
  isError = false,
}) => {
  const { theme } = useTheme();
  const iconColor = theme === "dark" ? "#22c55e" : "#16a34a";
  const errorColor = theme === "dark" ? "#ef4444" : "#dc2626";

  return (
    <Toast.Provider>
      <Toast.Root
        className="bg-foreground text-background text-start p-4 rounded-xl shadow-lg"
        duration={10000}
        open={open}
        onOpenChange={setOpen}
      >
        <div className="flex items-start gap-3">
          <div className="mt-1">
            {isError ? (
              <AlertCircle color={errorColor} size={20} />
            ) : (
              <CircleCheck color={iconColor} size={20} />
            )}
          </div>
          <div className="flex-1">
            <Toast.Title className="font-bold">
              {isError
                ? "Failed to remove source"
                : "Source removed successfully"}
            </Toast.Title>
            <Toast.Description className="text-background/80 text-sm">
              <div className="grid grid-cols-1 mt-1">
                <span className="font-medium">
                  Collection:{" "}
                  <span className="font-mono text-xs">{collectionName}</span>
                </span>
                <span className="font-light text-xs font-mono truncate max-w-[300px] text-background/70">
                  {sourceName}
                </span>
                {!isError && (
                  <span className="text-xs mt-1 font-medium">
                    Documents removed: {response.documents_deleted}
                  </span>
                )}
                {response.message && (
                  <span className="text-xs italic text-background/70 mt-1">
                    {response.message}
                  </span>
                )}
              </div>
            </Toast.Description>
          </div>
        </div>
        <Toast.Close asChild className="absolute top-4 right-4">
          <button
            aria-label="Close notification"
            className="cursor-pointer"
            type="button"
          >
            <CircleX
              color={theme === "dark" ? "#d1d5db" : "#6b7280"}
              data-testid="close-button"
              size={18}
            />
          </button>
        </Toast.Close>
      </Toast.Root>
      <Toast.Viewport className="fixed bottom-0 right-0 z-[2147483647] m-0 flex w-[390px] max-w-[100vw] list-none flex-col gap-2.5 p-[var(--viewport-padding)] outline-none [--viewport-padding:_25px]" />
    </Toast.Provider>
  );
};

export default SourceDeletedToast;
