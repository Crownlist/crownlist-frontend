// lib/useToastMessage.ts
"use client";

import { toast } from "@/components/ui/use-toast";
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

    toast({
      title: indicator.toUpperCase(),
      description: mssg,
      variant: indicator === "error" ? "destructive" : "default",
    });

    setSnackBarOpen(true);
  };

  return { handleMessage, handleSnack, snackBarOpen, setSnackBarOpen };
};
