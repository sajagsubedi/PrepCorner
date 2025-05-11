import mongoose, { Document, Schema } from "mongoose";

interface Answer {
  answer: string;
}

interface Question {
  body: string;
  answers: Answer[];
  correctAnswer: number; // index of correct answer in answers array
}

export interface QuestionSet extends Document {
  name: string;
  duration: number; // in seconds or minutes
  numberOfQuestions: number;
  questions: Question[];
  categoryId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const answerSchema = new Schema<Answer>(
  {
    answer: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const questionSchema = new Schema<Question>(
  {
    body: {
      type: String,
      required: true,
    },
    answers: {
      type: [answerSchema],
      required: true,
      validate: [
        (arr: Answer[]) => arr.length >= 2,
        "At least 2 answers required",
      ],
    },
    correctAnswer: {
      type: Number,
      required: true,
      validate: {
        validator: function (this: Question, value: number) {
          return value >= 0 && value < this.answers.length;
        },
        message: "correctAnswer index must point to one of the answers",
      },
    },
  },
  { _id: false }
);

const questionSetSchema = new Schema<QuestionSet>(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 100,
      trim: true,
    },
    duration: {
      type: Number,
      required: true,
      min: 1, // duration must be positive
    },
    numberOfQuestions: {
      type: Number,
      required: true,
      min: 1,
    },
    questions: {
      type: [questionSchema],
      required: true,
      validate: {
        validator: function (this: QuestionSet, val: Question[]) {
          return val.length === this.numberOfQuestions;
        },
        message: "questions array length must match numberOfQuestions",
      },
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  },
  { timestamps: true }
);

const QuestionSetModel =
  (mongoose.models.QuestionSet as mongoose.Model<QuestionSet>) ||
  mongoose.model("QuestionSet", questionSetSchema);

export default QuestionSetModel;
