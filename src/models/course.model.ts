import mongoose, { Document, Schema } from "mongoose";

export interface ICourse extends Document {
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

const courseSchema = new Schema<ICourse>(
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
  },
  { timestamps: true }
);

const CourseModel =
  (mongoose.models.Course as mongoose.Model<ICourse>) ||
  mongoose.model("Course", courseSchema);

export default CourseModel;
