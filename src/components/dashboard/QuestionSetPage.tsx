"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import { QuestionSet } from "@/types/questionSet";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { QuestionSetInput } from "@/schemas/questionSetSchema";
import { QuestionSetCard } from "./QuestionSetCard";
import QuestionSetModal from "./QuestionSetModal";

interface QuestionSetPageProps {
  questionSets: QuestionSet[];
  categoryId: string;
}

export default function QuestionSetPage({
  questionSets,
  categoryId,
}: QuestionSetPageProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedQuestionSet, setSelectedQuestionSet] =
    useState<QuestionSet | null>(null);
  const [questionSetList, setQuestionSetList] =
    useState<QuestionSet[]>(questionSets);

  const handleAddClick = () => {
    setSelectedQuestionSet(null);
    setDialogOpen(true);
  };

  const handleEditClick = (questionSet: QuestionSet) => {
    setSelectedQuestionSet(questionSet);
    setDialogOpen(true);
  };

  const onCancel = () => {
    setSelectedQuestionSet(null);
    setDialogOpen(false);
  };

  const handleSave = async (data: QuestionSetInput) => {
    try {
      const { name } = data;

      const formData = new FormData();
      formData.append("categoryId", categoryId);
      if (name) formData.append("name", name);

      if (!selectedQuestionSet) {
        const response = await axios.post<ApiResponse>(
          "/api/admin/questionsets",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        toast.success(response.data.message);
        if (response.data.success) {
          setQuestionSetList((prev) => [
            ...prev,
            response.data.data as QuestionSet,
          ]);
          setDialogOpen(false);
        }
      } else {
        const response = await axios.put<ApiResponse>(
          `/api/admin/questionsets/${selectedQuestionSet._id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (response.data.success) {
          setQuestionSetList((prev) =>
            prev.map((questionSet) =>
              questionSet._id === selectedQuestionSet._id
                ? (response.data.data as QuestionSet)
                : questionSet
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
        "There was a problem saving the question set. Please try again.";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="mx-auto px-7 sm:px-10 bg-transparent w-full">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-primary">Question Sets</h1>
        <Button onClick={handleAddClick}>
          <Plus size={18} className="mr-2" />
          Add Question Set
        </Button>
      </div>

      {questionSetList.length > 0 && (
        <p className="text-lg text-gray-500 mb-4">
          {questionSetList.length} question sets found
        </p>
      )}

      <div className="grid grid-cols-3 gap-6">
        {questionSetList.map((questionSet: QuestionSet) => (
          <QuestionSetCard
            key={questionSet._id}
            questionSet={questionSet}
            onEdit={handleEditClick}
          />
        ))}
      </div>

      {questionSetList.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed border-gray-200 rounded-lg">
          <p className="text-lg text-gray-500 mb-4">No question sets found</p>
          <Button onClick={handleAddClick}>Add first question set</Button>
        </div>
      )}

      <QuestionSetModal
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSave}
        questionSet={selectedQuestionSet}
        onCancel={onCancel}
      />
    </div>
  );
}
