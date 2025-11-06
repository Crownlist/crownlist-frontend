import { useLogout } from "@/lib/useLogout";
import CustomLoader from "./CustomLoader";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { LogOut } from "lucide-react";

type LogoutModProps = {
  open: boolean;
  handleClose: () => void;
  userType?: "Admin" | "User";
};

export default function LogoutModal({ open, handleClose, userType = "User" }: LogoutModProps) {
  const {
    mutateLogout,
    isLoading,
  } = useLogout(userType);

  const handleLogout = () => {
    handleClose();
    mutateLogout();
  };

  return (
    <>
      <AlertDialog open={open} onOpenChange={handleClose}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <LogOut className="h-5 w-5" />
              Logout Confirmation
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              Are you sure you want to log out of your session?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="justify-center gap-3">
            <AlertDialogCancel onClick={handleClose}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Yes, proceed
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {isLoading && (
        <CustomLoader text="Logging out..." />
      )}
    </>
  );
}
