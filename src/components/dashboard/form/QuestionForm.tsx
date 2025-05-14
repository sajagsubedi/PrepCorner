import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { questionSchema, questionInput } from "@/schemas/questionSchema";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

interface QuestionSetFormProps {
  onSubmit: (data: questionInput) => Promise<void>;
  onCancel: () => void;
}

export function QuestionForm({ onSubmit, onCancel }: QuestionSetFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<questionInput>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      images: [],
      body: "",
      answers: [{ answer: "" }, { answer: "" }, { answer: "" }, { answer: "" }],
      correctAnswer: -1,
    },
  });

  const { fields } = useFieldArray({
    control,
    name: "answers",
  });

  const handleImageChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const files = e?.target?.files;
    if (files && files.length > 0) {
      const arr = Array.from(files);
      setValue("images", arr);
    }
  };

  const handleCheckboxChange = (index: number) => {
    setValue("correctAnswer", index);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 p-6 bg-white rounded-lg shadow"
    >
      {/* Image Upload Section */}
      <div className="space-y-2">
        <label
          htmlFor="images"
          className="block text-sm font-medium text-gray-700"
        >
          Upload Images
        </label>
        <input
          id="images"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
        />
        {errors.images && (
          <p className="text-sm text-red-500">{errors.images.message}</p>
        )}
      </div>
      {/* Question Body */}
      <div className="space-y-2">
        <label
          htmlFor="body"
          className="block text-sm font-medium text-gray-700"
        >
          Question Body
        </label>
        <textarea
          id="body"
          {...register("body")}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          placeholder="Enter question body"
          rows={4}
        />
        {errors.body && (
          <p className="text-sm text-red-500">{errors.body.message}</p>
        )}
      </div>
      {/* Answers Section */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Answers
        </label>
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-center gap-3 mb-2">
            <input
              {...register(`answers.${index}.answer`)}
              className="flex-1 rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
              placeholder={`Answer ${index + 1}`}
            />
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={Number(watch("correctAnswer")) === index}
                onChange={() => handleCheckboxChange(index)}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                title="Mark as correct answer"
              />
              <CheckCircle2
                className={`h-5 w-5 ${
                  Number(watch("correctAnswer")) === index
                    ? "text-green-500"
                    : "text-gray-300"
                }`}
              />
            </div>
          </div>
        ))}
        {errors.answers && (
          <p className="text-sm text-red-500">{errors.answers.message}</p>
        )}
      </div>
      {/* Form Actions */}
      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onCancel} type="button">
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Question"}
        </Button>
      </div>
    </form>
  );
}
