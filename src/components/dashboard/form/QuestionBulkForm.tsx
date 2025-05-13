import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  questionBulkSchema,
  questionBulkInput,
} from "@/schemas/questionSchema";
import { Button } from "@/components/ui/button";

interface QuestionSetFormProps {
  onSubmit: (data: questionBulkInput) => Promise<void>;
  onCancel: () => void;
}

export function QuestionBulkForm({ onSubmit, onCancel }: QuestionSetFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<questionBulkInput>({
    resolver: zodResolver(questionBulkSchema),
    defaultValues: {
      questions: "[]",
      images: [],
    },
  });

  const handleImageChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const files = e?.target?.files;
    console.log("Files are", files);
    if (files && files.length > 0) {
      const arr = Array.from(files);
      console.log("array", arr);
      setValue("images", arr);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <label
          htmlFor="images"
          className="block text-sm font-medium text-gray-700"
        >
          Images
        </label>
        <input
          id="images"
          className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
          placeholder="Provide images"
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
        />
        {errors.images && (
          <p className="text-sm text-red-500">{errors.images.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <label
          htmlFor="questions"
          className="block text-sm font-medium text-gray-700"
        >
          Questions
        </label>
        <textarea
          id="questions"
          {...register("questions")}
          className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
          placeholder="Enter questions"
          rows={4}
        />
        {errors.questions && (
          <p className="text-sm text-red-500">{errors.questions.message}</p>
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
