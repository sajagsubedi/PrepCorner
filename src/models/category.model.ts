import mongoose, { Document, Schema } from "mongoose";

export interface ICategory extends Document {
  name: string;
  description: string;
  courseId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 100,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 1000,
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
  },
  { timestamps: true }
);

const CategoryModel =
  (mongoose.models.Category as mongoose.Model<ICategory>) ||
  mongoose.model("Category", categorySchema);

export default CategoryModel;
