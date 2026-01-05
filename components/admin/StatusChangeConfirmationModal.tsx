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

interface StatusChangeConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    currentStatus: string;
    newStatus: string;
    itemType: "category" | "subcategory";
    itemName?: string;
}

export function StatusChangeConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    currentStatus,
    newStatus,
    itemType,
    itemName,
}: StatusChangeConfirmationModalProps) {
    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Status Change</AlertDialogTitle>
                    <AlertDialogDescription className="space-y-2">
                        <p>
                            Are you sure you want to change the status of this {itemType}
                            {itemName && (
                                <>
                                    {" "}
                                    <span className="font-semibold text-foreground">
                                        &quot;{itemName}&quot;
                                    </span>
                                </>
                            )}{" "}
                            from{" "}
                            <span
                                className={`font-semibold ${currentStatus === "active"
                                        ? "text-green-600"
                                        : "text-red-600"
                                    }`}
                            >
                                {currentStatus}
                            </span>{" "}
                            to{" "}
                            <span
                                className={`font-semibold ${newStatus === "active" ? "text-green-600" : "text-red-600"
                                    }`}
                            >
                                {newStatus}
                            </span>
                            ?
                        </p>
                        {newStatus === "inactive" && (
                            <p className="text-sm text-muted-foreground mt-2">
                                Note: Making this {itemType} inactive will hide it from users.
                            </p>
                        )}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleConfirm}
                        className="bg-[#1F058F] hover:bg-[#1F058F]/90"
                    >
                        Confirm
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
