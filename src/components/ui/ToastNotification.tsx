import * as Toast from "@radix-ui/react-toast";
import { CircleX } from "lucide-react";
import { useTheme } from "next-themes";

export interface ToastResponse {
  message: string;
  id: string;
  updatedAt: Date;
}

interface ToastNotificationProps {
  response: ToastResponse;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const ToastNotification: React.FC<ToastNotificationProps> = ({
  response,
  open,
  setOpen,
}) => {
  const { theme } = useTheme();

  return (
    <Toast.Provider>
      <Toast.Root
        className="bg-foreground text-background text-start p-4 rounded-xl shadow-lg"
        open={open}
        onOpenChange={setOpen}
      >
        <Toast.Title className="font-bold">{response.message}</Toast.Title>
        <Toast.Description className="text-background text-xs text-slate-500">
          <div className="grid grid-cols-1 italic">
            <span>report id: {response.id}</span>
            <span>updated at: {response.updatedAt.toLocaleString()}</span>
          </div>
        </Toast.Description>
        <Toast.Close asChild className="absolute top-7 right-7">
          <CircleX color={theme === "dark" ? "#831843" : "#f472b6"} />
        </Toast.Close>
      </Toast.Root>
      <Toast.Viewport className="fixed bottom-0 right-0 z-[2147483647] m-0 flex w-[390px] max-w-[100vw] list-none flex-col gap-2.5 p-[var(--viewport-padding)] outline-none [--viewport-padding:_25px]" />
    </Toast.Provider>
  );
};

export default ToastNotification;
