import { LoaderCircle } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";

interface DeleteModalProps {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}
const DeleteModal = ({
  isOpen,
  message,
  onCancel,
  onConfirm,
  isDeleting,
}: DeleteModalProps) => {
  return (
    <>
      {isOpen && (
        <div className="max-h-screen bg-gray-900/25 w-full h-screen flex py-3 px-3 justify-center fixed z-[999] top-0 left-0">
          <div className="w-96 h-max bg-white rounded-md p-5 flex-flex-col mt-5 items-center gap-2">
            <h2 className="text-primary font-semibold text-center mb-3">
              Delete Confirmation
            </h2>
            <p className="text-center">
              Are you sure you want to delete this {message}? This action cannot
              be undone.
            </p>
            <div className="flex gap-5 w-full mt-5 justify-center">
              <Button className="min-w-28" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button
                onClick={onConfirm}
                disabled={isDeleting}
                className="min-w-28"
              >
                <LoaderCircle
                  className={`animate-spin text-xl ${
                    isDeleting ? "block" : "hidden"
                  }`}
                />
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeleteModal;
