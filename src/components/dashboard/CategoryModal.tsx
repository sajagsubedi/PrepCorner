"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CategoryForm } from "@/components/dashboard/CategoryForm";
import { Category } from "@/types/category";
import { CategoryInput } from "@/schemas/categorySchema";

interface CategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: CategoryInput) => Promise<void>;
  category: Category | null;
  onCancel: () => void;
}

export default function CategoryModal({
  open,
  onOpenChange,
  onSave,
  category,
  onCancel,
}: CategoryDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {category ? "Edit Category" : "Add Category"}
          </DialogTitle>
        </DialogHeader>
        <CategoryForm
          defaultValues={category}
          onSubmit={onSave}
          onCancel={onCancel}
        />
      </DialogContent>
    </Dialog>
  );
}
