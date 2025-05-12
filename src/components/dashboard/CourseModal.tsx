"use client";

import React from "react";
import { Course } from "@/types/course";
import { CourseInput } from "@/schemas/courseSchema";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CourseForm } from "@/components/dashboard/CourseForm";

interface CourseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: CourseInput) => Promise<void>;
  course?: Course | null;
  onCancel: () => void;
}

export default function CourseModal({
  open,
  onOpenChange,
  onSave,
  course,
  onCancel,
}: CourseDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{course ? "Edit Course" : "Add Course"}</DialogTitle>
        </DialogHeader>
        <CourseForm
          defaultValues={course}
          onSubmit={onSave}
          onCancel={onCancel}
        />
      </DialogContent>
    </Dialog>
  );
}
