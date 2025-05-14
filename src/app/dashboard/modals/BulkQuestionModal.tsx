"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { QuestionBulkForm } from "@/components/dashboard/form/QuestionBulkForm";
import { questionBulkInput } from "@/schemas/questionSchema";

interface QuestionSetDialogProps {
  open: boolean;
  onSave: (data: questionBulkInput) => Promise<void>;
  onCancel: () => void;
}

export default function BulkQuestionModal({
  open,
  onSave,
  onCancel,
}: QuestionSetDialogProps) {
  return (
    <Dialog open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Bulk Questions</DialogTitle>
        </DialogHeader>
        <QuestionBulkForm onSubmit={onSave} onCancel={onCancel} />
      </DialogContent>
    </Dialog>
  );
}
