import { useState, useEffect } from "react";

import { ToastResponse } from "@/components/ui/ToastNotification";

export const useToast = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState<ToastResponse>({
    message: "",
    id: "",
    updatedAt: new Date(),
  });

  useEffect(() => {
    const notification = localStorage.getItem("reportNotification");

    if (notification) {
      setTimeout(() => {
        try {
          const parsedNotification = JSON.parse(notification);

          // Ensure updatedAt is converted to Date object
          setMessage({
            ...parsedNotification,
            updatedAt: new Date(parsedNotification.updatedAt),
          });
          setOpen(true);
        } catch (error) {
          console.error("Failed to parse notification:", error);
        }
      }, 500);
      localStorage.removeItem("reportNotification");
    }
  }, []);

  return {
    toastOpen: open,
    toastMessage: message,
    setToastOpen: setOpen,
    setToastMessage: setMessage,
  };
};
