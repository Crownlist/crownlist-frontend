import { useEffect, useRef } from "react";
import Image from "next/image"


interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  onDelete: () => void;
  loading?: boolean;
}

export default function DeleteModal({ isOpen, onClose, onDelete, loading, description }: DeleteModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#000000d3] flex justify-center items-center z-50">
      <div ref={modalRef} className="bg-white rounded-lg p-6 text-center max-w-md w-full">
        <Image src="/del.svg" alt="Delete icon" width={20} height={20} className="mx-auto mb-4 w-8 h-8" />
        <h2 className="text-lg font-semibold mb-2">Are you sure you want to delete post?</h2>
        <p className="text-sm text-gray-600 mb-6">
          {description ? description : 'This action will delete post data temporarily. If you&apos;re not ready to delete post, you can cancel for now instead.'}
        </p>
        <div className="flex justify-center gap-4">
          <button
            className="bg-[#1F058F] text-white px-6 py-2 rounded-full disabled:opacity-60 disabled:cursor-not-allowed"
            onClick={onDelete}
            disabled={!!loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
          <button
            className="border border-[#1F058F] text-[#1F058F] px-6 py-2 rounded-full disabled:opacity-60 disabled:cursor-not-allowed"
            onClick={onClose}
            disabled={!!loading}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
