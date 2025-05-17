import mongoose, { Document, Schema } from "mongoose";

export interface TestResult extends Document {
  testSessionId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  questionSetId: mongoose.Types.ObjectId;

  totalQuestions: number;
  attempted: number;
  correct: number;
  incorrect: number;

  percentage: number;
  accuracy: number;

  submittedAt: Date;
}

const testResultSchema = new Schema<TestResult>(
  {
    testSessionId: {
      type: Schema.Types.ObjectId,
      ref: "TestSession",
      required: true,
      unique: true,
    },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    questionSetId: {
      type: Schema.Types.ObjectId,
      ref: "QuestionSet",
      required: true,
    },

    totalQuestions: { type: Number, required: true },
    attempted: { type: Number, required: true },
    correct: { type: Number, required: true },
    incorrect: { type: Number, required: true },

    percentage: { type: Number },
    accuracy: { type: Number },

    submittedAt: { type: Date, required: true },
  },
  { timestamps: true }
);

testResultSchema.pre("save", function (next) {
  console.log("Here ");
  if (this.totalQuestions > 0) {
    this.percentage = (this.correct / this.totalQuestions) * 100;
  } else {
    this.percentage = 0;
  }

  if (this.attempted > 0) {
    this.accuracy = (this.correct / this.attempted) * 100;
  } else {
    this.accuracy = 0;
  }

  next();
});

const TestResultModel =
  (mongoose.models.TestResult as mongoose.Model<TestResult>) ||
  mongoose.model("TestResult", testResultSchema);

export default TestResultModel;
