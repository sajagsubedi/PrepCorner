import mongoose, { Document, Schema } from "mongoose";

export interface Class extends Document {
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

const classSchema = new Schema<Class>(
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

const ClassModel =
  (mongoose.models.Class as mongoose.Model<Class>) ||
  mongoose.model("Class", classSchema);

export default ClassModel;
