import mongoose, { Document, Schema } from "mongoose";

export interface QuestionSet extends Document {
  name: string;
  duration: number;
  questionIds: mongoose.Types.ObjectId[];
  categoryId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const questionSetSchema = new Schema<QuestionSet>(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 100,
    },
    duration: {
      type: Number,
      required: true,
      min: 1, // duration in minutes or seconds
    },
    questionIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "Question",
        required: true,
      },
    ],
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
