import { Question } from "./question";

export interface QuestionSet {
  _id: string;
  name: string;
  duration: number;
  questionIds: Array<string>;
  questions?: Array<Question>;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
}
