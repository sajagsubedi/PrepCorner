export interface Answer {
  answer: string;
}

export interface Question {
  _id: string;
  body: string;
  answers: Answer[];
  correctAnswer: number;
  createdAt: Date;
  updatedAt: Date;
}
