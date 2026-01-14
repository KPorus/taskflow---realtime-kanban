// DeleteTaskConfirmModal.tsx
import React from "react";
import { Modal } from "../ui/Modal";
import { AlertTriangle } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  taskTitle: string;
  onConfirm: () => void;
}

export const DeleteTaskConfirmModal: React.FC<Props> = ({
  isOpen,
  onClose,
  taskTitle,
  onConfirm,
}) => (
  <Modal isOpen={isOpen} onClose={onClose} title="Delete Task">
    <div className="space-y-4">
      <div className="flex items-center gap-3 text-amber-600 bg-amber-50 p-3 rounded-md border border-amber-100">
        <AlertTriangle size={24} className="flex-shrink-0" />
        <p className="text-sm">This action cannot be undone.</p>
      </div>
      <p className="text-gray-600">
        Are you sure you want to permanently delete the task
        <span className="font-semibold text-gray-900 mx-1">
          "{taskTitle}"
        </span>
        ?
      </p>
      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
        >
          Delete Task
        </button>
      </div>
    </div>
  </Modal>
);
