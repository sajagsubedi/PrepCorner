import mongoose, { Document, Schema } from "mongoose";

export interface IQuestion {
  questionId: mongoose.Types.ObjectId;
  markedForLater: boolean;
  selectedAnswer: number;
  isAttempted: boolean;
}

export interface TestSession extends Document {
  userId: mongoose.Types.ObjectId;
  questionSetId: mongoose.Types.ObjectId;
  responses: IQuestion[];
  isSubmitted: boolean;
  duration: number;
  isExam: boolean;
  startDate?: Date;
  endDate?: Date;
}

const QuestionSchema = new Schema<IQuestion>(
  {
    questionId: {
      type: Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },
    markedForLater: { type: Boolean, default: false },
    selectedAnswer: { type: Number, default: -1 },
    isAttempted: { type: Boolean, default: false },
  },
  { _id: false }
);

const testSessionSchema = new Schema<TestSession>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    questionSetId: {
      type: Schema.Types.ObjectId,
      ref: "QuestionSet",
      required: true,
    },
    responses: [QuestionSchema],
    isSubmitted: { type: Boolean, default: false },
    duration: { type: Number, required: true },
    isExam: {
      type: Boolean,
      default: false,
    },
    startDate: {
      type: Date,
      required: function (this: TestSession) {
        return this.isExam;
      },
    },
    endDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Pre-save middleware to calculate endDate for exams
testSessionSchema.pre("save", function (next) {
  console.log("inside");
  if (this.isExam && this.startDate && !this.endDate) {
    console.log("no bl");
    this.endDate = new Date(this.startDate.getTime() + this.duration * 1000);
    console.log("End date is ", new Date(this.endDate).toLocaleDateString());
  }
  next();
});

const TestSessionModel =
  (mongoose.models.TestSession as mongoose.Model<TestSession>) ||
  mongoose.model("TestSession", testSessionSchema);

export default TestSessionModel;
