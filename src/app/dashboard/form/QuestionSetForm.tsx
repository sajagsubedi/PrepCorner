import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  questionSetSchema,
  QuestionSetInput,
} from "@/schemas/questionSetSchema";
import { QuestionSet } from "@/types/questionSet";
import { Button } from "@/components/ui/button";

interface QuestionSetFormProps {
  defaultValues: QuestionSet | null;
  onSubmit: (data: QuestionSetInput) => Promise<void>;
  onCancel: () => void;
}

export function QuestionSetForm({
  defaultValues,
  onSubmit,
  onCancel,
}: QuestionSetFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<QuestionSetInput>({
    resolver: zodResolver(questionSetSchema),
    defaultValues: {
      name: defaultValues?.name || "",
      duration: defaultValues?.duration
        ? Math.floor(defaultValues.duration / 60)
        : 0,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Question Set Name
        </label>
        <input
          id="name"
          type="text"
          {...register("name")}
          className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
          placeholder="Enter question set name"
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
          Duration (minutes)
        </label>
        <input
          id="duration"
          type="number"
          {...register("duration", { valueAsNumber: true })}
          className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
          placeholder="Enter duration (in minutes)"
        />
        {errors.duration && (
          <p className="text-sm text-red-500">{errors.duration.message}</p>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" onClick={onCancel} type="button">
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Question Set"}
        </Button>
      </div>
    </form>
  );
}
