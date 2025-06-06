"use client";

import React from "react";
import { CheckCircle, XCircle, Bookmark, List } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ConfirmDialogProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  stats: {
    total: number;
    attempted: number;
    notAttempted: number;
    marked: number;
  };
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  onCancel,
  onSubmit,
  isSubmitting,
  stats,
}) => {
  return (
    <Dialog open={open} onOpenChange={(val) => !val && onCancel()}>
      <DialogContent className="max-w-md text-center rounded-xl">
        <DialogHeader>
          <div className="flex justify-center mb-2">
            <div className="bg-gray-200 p-3 rounded-full">
              <List size={24} className="text-black" />
            </div>
          </div>
          <DialogTitle className="text-lg font-semibold">
            Would you like to submit your answer?
          </DialogTitle>
        </DialogHeader>

        <div className="my-4 space-y-3 text-left">
          <StatRow
            icon={<List className="text-gray-600" />}
            label="Total"
            value={stats.total}
          />
          <StatRow
            icon={<CheckCircle className="text-gray-700" />}
            label="Attempted"
            value={stats.attempted}
            valueClass="text-red-500"
          />
          <StatRow
            icon={<XCircle className="text-gray-600" />}
            label="Not Attempted"
            value={stats.notAttempted}
            valueClass="text-blue-500"
          />
          <StatRow
            icon={<Bookmark className="text-yellow-600" />}
            label="Marked"
            value={stats.marked}
            valueClass="text-orange-500"
          />
        </div>

        <DialogFooter className="flex justify-center gap-4">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={onSubmit} disabled={isSubmitting}>
            {!isSubmitting ? "Submit" : "Submitting..."}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const StatRow = ({
  icon,
  label,
  value,
  valueClass = "text-black",
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  valueClass?: string;
}) => (
  <div className="flex items-center justify-between px-4">
    <div className="flex items-center gap-2 text-gray-700">
      {icon}
      <span>{label}</span>
    </div>
    <div className={`font-medium ${valueClass}`}>{value}</div>
  </div>
);

export default ConfirmDialog;
