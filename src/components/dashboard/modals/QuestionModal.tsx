"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { QuestionForm } from "../form/QuestionForm";
import { questionInput } from "@/schemas/questionSchema";

interface QuestionSetDialogProps {
  open: boolean;
  onSave: (data: questionInput) => Promise<void>;
  onCancel: () => void;
  onOpenChange: (value: boolean) => void;
}

export default function QuestionModal({
  open,
  onSave,
  onOpenChange,
  onCancel,
}: QuestionSetDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Question</DialogTitle>
        </DialogHeader>
        <QuestionForm onSubmit={onSave} onCancel={onCancel} />
      </DialogContent>
    </Dialog>
  );
}
