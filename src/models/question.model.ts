import mongoose, { Document, Schema } from "mongoose";

export interface Answer {
  answer: string;
}

export interface Question extends Document {
  body: string;
  answers: Answer[];
  correctAnswer: number; // index in answers array
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
        (val: Answer[]) => val.length >= 2,
        "At least two answers are required",
      ],
    },
    correctAnswer: {
      type: Number,
      required: true,
      validate: {
        validator: function (this: Question, value: number) {
          return value >= 0 && value < this.answers.length;
        },
        message: "Correct answer index must point to a valid answer",
      },
    },
  },
  { timestamps: true }
);

const QuestionModel =
  (mongoose.models.Question as mongoose.Model<Question>) ||
  mongoose.model("Question", questionSchema);

export default QuestionModel;
