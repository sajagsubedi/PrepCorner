"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import { QuestionSet } from "@/types/questionSet";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { QuestionSetInput } from "@/schemas/questionSetSchema";
import { QuestionSetCard } from "./cards/QuestionSetCard";
import QuestionSetModal from "./modals/QuestionSetModal";
import DeleteModal from "../shared/DeleteModal";

interface QuestionSetPageProps {
  questionSets: string;
  categoryId: string;
}

export default function QuestionSetPage({
  questionSets,
  categoryId,
}: QuestionSetPageProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [selectedQuestionSet, setSelectedQuestionSet] =
    useState<QuestionSet | null>(null);
  const [questionSetList, setQuestionSetList] = useState<QuestionSet[]>(
    JSON.parse(questionSets)
  );

  const handleAddClick = () => {
    setSelectedQuestionSet(null);
    setDialogOpen(true);
  };

  const handleEditClick = (questionSet: QuestionSet) => {
    setSelectedQuestionSet(questionSet);
    setDialogOpen(true);
  };

  const openDeleteModal = (questionSet: QuestionSet) => {
    setSelectedQuestionSet(questionSet);
    setDeleteModal(true);
  };

  const onCancel = () => {
    setSelectedQuestionSet(null);
    setDialogOpen(false);
  };
  const cancelDeleteQuestionSet = () => {
    setDeleteModal(false);
    setSelectedQuestionSet(null);
  };

  const handleSave = async (data: QuestionSetInput) => {
    try {
      const { name, duration } = data;

      const formData = new FormData();
      formData.append("categoryId", categoryId);
      if (name) formData.append("name", name);
      if (duration) formData.append("duration", String(duration * 60));

      if (!selectedQuestionSet) {
        const response = await axios.post<ApiResponse<QuestionSet>>(
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
        const response = await axios.put<ApiResponse<QuestionSet>>(
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
      const axiosError = error as AxiosError<ApiResponse<QuestionSet>>;
      const errorMessage =
        axiosError?.response?.data?.message ||
        "There was a problem saving the question set. Please try again.";
      toast.error(errorMessage);
    }
  };

  const handleDeleteQuestionSet = async () => {
    setIsDeleting(true);
    try {
      const response = await axios.delete<ApiResponse<undefined>>(
        `/api/admin/questionsets/${selectedQuestionSet?._id}`
      );
      if (response.data.success) {
        setQuestionSetList((prev) =>
          prev.filter(
            (questionSet) => questionSet._id !== selectedQuestionSet?._id
          )
        );
        toast.success(response.data.message);
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse<QuestionSet>>;
      const errorMessage =
        axiosError?.response?.data?.message ||
        "There was a problem deleting the question set. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
      setDeleteModal(false);
      setSelectedQuestionSet(null);
    }
  };

  return (
    <div className="mx-auto px-2 sm:px-10 bg-transparent w-full">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-2">
        <h1 className="text-2xl font-bold text-primary self-start">
          Question Sets
        </h1>
        <Button className="self-end w-max" onClick={handleAddClick}>
          <Plus size={18} className="mr-2" />
          Add Question Set
        </Button>
      </div>

      {questionSetList.length > 0 && (
        <p className="text-lg text-gray-500 mb-4">
          {questionSetList.length} question sets found
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {questionSetList.map((questionSet: QuestionSet) => (
          <QuestionSetCard
            key={questionSet._id}
            questionSet={questionSet}
            onDelete={openDeleteModal}
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

      <DeleteModal
        isOpen={deleteModal}
        message="Question Set"
        isDeleting={isDeleting}
        onConfirm={handleDeleteQuestionSet}
        onCancel={cancelDeleteQuestionSet}
      />
    </div>
  );
}
