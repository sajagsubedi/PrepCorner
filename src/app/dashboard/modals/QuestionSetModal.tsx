"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { QuestionSetForm } from "@/components/dashboard/form/QuestionSetForm";
import { QuestionSet } from "@/types/questionSet";
import { QuestionSetInput } from "@/schemas/questionSetSchema";

interface QuestionSetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: QuestionSetInput) => Promise<void>;
  questionSet: QuestionSet | null;
  onCancel: () => void;
}

export default function QuestionSetModal({
  open,
  onOpenChange,
  onSave,
  questionSet,
  onCancel,
}: QuestionSetDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {questionSet ? "Edit Question Set" : "Add Question Set"}
          </DialogTitle>
        </DialogHeader>
        <QuestionSetForm
          defaultValues={questionSet}
          onSubmit={onSave}
          onCancel={onCancel}
        />
      </DialogContent>
    </Dialog>
  );
}
