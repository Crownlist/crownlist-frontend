// lib/useToastMessage.ts
"use client";

import { toast } from "sonner";
import { useState } from "react";

export type ToastMessageType = {
  alert: "error" | "warning" | "info" | "success";
  message: string;
};

type AlertType = ToastMessageType["alert"];

export const useToast = () => {
  const [handleSnack, setHandleSnack] = useState<ToastMessageType>({
    alert: "info",
    message: "",
  });
  const [snackBarOpen, setSnackBarOpen] = useState(false);

  const handleMessage = (indicator: AlertType, mssg: string) => {
    setSnackBarOpen(false);
    setHandleSnack({ alert: indicator, message: mssg });

    const title = indicator.toUpperCase() + ": " + mssg;

    // Use Sonner toast
    switch (indicator) {
      case "error":
        toast.error(title);
        break;
      case "warning":
        toast.warning(title);
        break;
      case "info":
        toast.info(title);
        break;
      case "success":
        toast.success(title);
        break;
    }

    setSnackBarOpen(true);
  };

  return { handleMessage, handleSnack, snackBarOpen, setSnackBarOpen };
};
