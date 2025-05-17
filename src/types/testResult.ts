export interface TestResult {
  _id: string;
  testSessionId: string;
  userId: string;
  questionSetId: string;

  totalQuestions: number;
  attempted: number;
  correct: number;
  incorrect: number;

  percentage: number;
  accuracy: number;

  submittedAt: Date;
}
