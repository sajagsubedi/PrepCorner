export interface QuestionSet {
  _id: string;
  name: string;
  duration: number;
  questionIds: string[];
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
}
