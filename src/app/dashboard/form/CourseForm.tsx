import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { courseSchema, CourseInput } from "@/schemas/courseSchema";
import { Course } from "@/types/course";
import Image from "next/image";
import { Eye, EyeClosed, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CourseFormProps {
  defaultValues?: Course | null;
  onSubmit: (data: CourseInput) => Promise<void>;
  onCancel: () => void;
}

export function CourseForm({
  defaultValues,
  onSubmit,
  onCancel,
}: CourseFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CourseInput>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      name: defaultValues?.name || "",
      description: defaultValues?.description || "",
      isVisible: defaultValues?.isVisible ?? true,
      image: undefined,
    },
  });
  const [visibility, setVisibility] = useState<boolean>(
    defaultValues?.isVisible ?? true
  );

  const [imageUrl, setImageUrl] = React.useState<string>(
    defaultValues?.image?.url || "/assets/placeholder.png"
  );

  const handleImageChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("image", file);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      new Promise<string>((resolve) => {
        reader.onloadend = () => resolve(reader.result as string);
      }).then((preview) => setImageUrl(preview));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="mb-4">
        <label htmlFor="image" className="leading-7 text-sm text-gray-600">
          Course Image
        </label>
        <div className="w-full flex justify-center">
          <div className="bg-gray-50 rounded-lg overflow-hidden w-48 h-32 relative">
            <Image
              src={imageUrl}
              width={192}
              height={128}
              alt="Course thumbnail"
              className="w-full h-full object-cover"
            />
            <div className="absolute w-full h-full top-0 right-0 flex justify-center items-center">
              <Plus className="text-white absolute" />
            </div>
            <div className="absolute w-full h-full top-0 right-0 flex justify-center items-center bg-gray-600 opacity-20"></div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="absolute z-[99] inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
        </div>
        {errors.image && (
          <p className="text-red-500 text-sm">{errors.image.message}</p>
        )}
      </div>
      <div className="items-center flex gap-2">
        <span className="text-sm font-medium text-gray-700">Visibility:</span>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            setVisibility((val: boolean) => !val);
            setValue("isVisible", !visibility);
          }}
          className={`p-2 rounded-full ${
            visibility
              ? "bg-rose-100 text-rose-500"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {visibility ? <Eye size={20} /> : <EyeClosed size={20} />}
        </button>
      </div>
      <div className="space-y-2">
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Course Name 2
        </label>
        <input
          id="name"
          type="text"
          {...register("name")}
          className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
          placeholder="Enter course name"
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Course Description
        </label>
        <textarea
          id="description"
          {...register("description")}
          className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
          placeholder="Enter course description"
          rows={4}
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" onClick={onCancel} type="button">
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Course"}
        </Button>
      </div>
    </form>
  );
}
