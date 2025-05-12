import { QuestionSet } from "../types/questionSet";

export interface Category {
  _id: string;
  name: string;
  description: string;
  courseId: string;
  questionSets?: Array<QuestionSet>;
  createdAt: Date;
  updatedAt: Date;
}
