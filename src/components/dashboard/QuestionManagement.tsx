"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import BulkQuestionModal from "./modals/BulkQuestionModal";
import { questionBulkInput, questionInput } from "@/schemas/questionSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { toast } from "react-toastify";
import { QuestionSet } from "@/types/questionSet";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import QuestionModal from "./modals/QuestionModal";
import { Question } from "@/types/question";

const QuestionManagement = ({ questionSetId }: { questionSetId: string }) => {
  const [addQuestionModal, setAddQuestionModal] = useState(false);
  const [bulkQuestionModal, setBulkQuestionModal] = useState(false);

  const handleAddQuestion = () => {
    setAddQuestionModal(true);
    console.log(addQuestionModal);
  };

  const handleAddBulkQuestion = () => {
    setBulkQuestionModal(true);
  };

  const handleBulkCancel = () => {
    setBulkQuestionModal(false);
  };
  const handleQuestionCancel = () => {
    setBulkQuestionModal(false);
  };

  const handleQuestionUpload = async (data: questionInput) => {
    try {
      const { body, answers, correctAnswer, images } = data;

      const formData = new FormData();
      formData.append("questionSetId", questionSetId);
      if (body) formData.append("body", body);
      if (correctAnswer)
        formData.append("correctAnswer", String(correctAnswer));

      answers.forEach((answer) => {
        formData.append("answers", answer.answer);
      });

      images.forEach((image) => {
        formData.append("images", image);
      });

      const response = await axios.post<ApiResponse<QuestionSet>>(
        "/api/admin/questions",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success(response.data.message);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse<Question>>;
      const errorMessage =
        axiosError?.response?.data?.message ||
        "There was a problem saving the course. Please try again.";
      toast.error(errorMessage);
    }
  };
  const handleBulkUpload = async (data: questionBulkInput) => {
    try {
      const { questions, images } = data;

      const formData = new FormData();
      formData.append("questionSetId", questionSetId);
      if (questions) formData.append("questions", questions);
      images.forEach((image) => {
        formData.append("images", image);
      });

      const response = await axios.post<ApiResponse<QuestionSet>>(
        "/api/admin/bulkquestions",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success(response.data.message);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse<QuestionSet>>;
      const errorMessage =
        axiosError?.response?.data?.message ||
        "There was a problem saving the course. Please try again.";
      toast.error(errorMessage);
    }
  };
  const router = useRouter();
  const onBack = () => {
    router.back();
  };

  return (
    <>
      <div className="flex gap-2 justify-between py-3 px-10">
        <Button onClick={onBack}>
          <ArrowLeft />
          Back
        </Button>
        <div className="flex gap-2 justify-end">
          <Button onClick={handleAddQuestion}>Add Question</Button>
          <Button onClick={handleAddBulkQuestion}>Add Bulk Questions</Button>
        </div>
      </div>
      <BulkQuestionModal
        open={bulkQuestionModal}
        onSave={handleBulkUpload}
        onOpenChange={(value: boolean) => setBulkQuestionModal(value)}
        onCancel={handleBulkCancel}
      />
      {addQuestionModal && (
        <QuestionModal
          open={addQuestionModal}
          onSave={handleQuestionUpload}
          onOpenChange={(value: boolean) => setAddQuestionModal(value)}
          onCancel={handleQuestionCancel}
        />
      )}
    </>
  );
};

export default QuestionManagement;
