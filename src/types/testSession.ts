import { Question } from "./question";

interface Course {
  _id: string;
  name: string;
}

interface Category {
  _id: string;
  name: string;
  courseId: Course;
}

interface QuestionSet {
  _id: string;
  name: string;
  categoryId: Category;
}

export interface QuestionResponse {
  questionId: string;
  question?: Question;
  markedForLater: boolean;
  selectedAnswer: number | null;
  isAttempted: boolean;
}

export interface TestSession {
  _id: string;
  userId: string;
  questionSetId: QuestionSet;
  responses: QuestionResponse[];
  isSubmitted: boolean;
  duration: number;
  isExam: boolean;
  startDate?: string;
  endDate?: string;
}
