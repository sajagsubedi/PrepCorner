"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import BulkQuestionModal from "./modals/BulkQuestionModal";
import { questionBulkInput } from "@/schemas/questionSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { toast } from "react-toastify";
import { QuestionSet } from "@/types/questionSet";

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

  return (
    <>
      <div className="flex gap-2 justify-end py-3 px-3">
        <Button onClick={handleAddQuestion}>Add Question</Button>
        <Button onClick={handleAddBulkQuestion}>Add Bulk Questions</Button>
      </div>
      {bulkQuestionModal && (
        <BulkQuestionModal
          open={bulkQuestionModal}
          onSave={handleBulkUpload}
          onCancel={handleBulkCancel}
        />
      )}
    </>
  );
};

export default QuestionManagement;
