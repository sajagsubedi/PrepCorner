import mongoose from "mongoose";

export interface PopulatedQuestion {
  _id: string;
  body: string;
  answers: { answer: string }[];
  correctAnswer: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PopulatedQuestionSet {
  _id: string;
  name: string;
  categoryId: string;
}

export interface PopulatedTestSession {
  _id: mongoose.Types.ObjectId;
  userId: { _id: string };
  questionSetId: PopulatedQuestionSet;
  responses: {
    questionId: PopulatedQuestion;
    markedForLater: boolean;
    selectedAnswer: number;
    isAttempted: boolean;
  }[];
  isSubmitted: boolean;
  duration: number;
  isExam: boolean;
  startDate?: Date;
  endDate?: Date;
}
