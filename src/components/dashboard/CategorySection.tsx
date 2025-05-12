"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import { CategoryCard } from "@/components/dashboard/CategoryCard";
import CategoryModal from "@/components/dashboard/CategoryModal";
import { Category } from "@/types/category";
import { CategoryInput } from "@/schemas/categorySchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";

interface CategoryPageProps {
  categories: Category[];
  courseId: string;
}

export default function CategoryPage({
  categories,
  courseId,
}: CategoryPageProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [categoryList, setCategoryList] = useState<Category[]>(categories);

  const handleAddClick = () => {
    setSelectedCategory(null);
    setDialogOpen(true);
  };

  const handleEditClick = (category: Category) => {
    setSelectedCategory(category);
    setDialogOpen(true);
  };

  const onCancel = () => {
    setSelectedCategory(null);
    setDialogOpen(false);
  };

  const handleSave = async (data: CategoryInput) => {
    try {
      const { name, description } = data;

      const formData = new FormData();
      formData.append("courseId", courseId);
      if (name) formData.append("name", name);
      if (description) formData.append("description", description);

      if (!selectedCategory) {
        const response = await axios.post<ApiResponse>(
          "/api/admin/categories",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        toast.success(response.data.message);
        if (response.data.success) {
          setCategoryList((prev) => [...prev, response.data.data as Category]);
          setDialogOpen(false);
        }
      } else {
        const response = await axios.put<ApiResponse>(
          `/api/admin/categories/${selectedCategory._id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (response.data.success) {
          setCategoryList((prev) =>
            prev.map((category) =>
              category._id === selectedCategory._id
                ? (response.data.data as Category)
                : category
            )
          );
          toast.success(response.data.message);
          setDialogOpen(false);
        }
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage =
        axiosError?.response?.data?.message ||
        "There was a problem saving the category. Please try again.";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="mx-auto px-7 sm:px-10 bg-transparent w-full">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-primary">Categories</h1>
        <Button onClick={handleAddClick}>
          <Plus size={18} className="mr-2" />
          Add Category
        </Button>
      </div>

      {categoryList.length > 0 && (
        <p className="text-lg text-gray-500 mb-4">
          {categoryList.length} categories found
        </p>
      )}

      <div className="grid grid-cols-3 gap-6">
        {categoryList.map((category: Category) => (
          <CategoryCard
            key={category._id}
            category={category}
            onEdit={handleEditClick}
          />
        ))}
      </div>

      {categoryList.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed border-gray-200 rounded-lg">
          <p className="text-lg text-gray-500 mb-4">No categories found</p>
          <Button onClick={handleAddClick}>Add first category</Button>
        </div>
      )}

      <CategoryModal
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSave}
        category={selectedCategory}
        onCancel={onCancel}
      />
    </div>
  );
}
