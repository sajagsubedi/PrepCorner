import mongoose, { Document, Schema } from "mongoose";

export enum EnrollmentRequestStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

export interface IEnrollmentRequest extends Document {
  user: mongoose.Types.ObjectId;
  course: mongoose.Types.ObjectId;
  status: EnrollmentRequestStatus;
  reason?: string;
  requestedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const enrollmentRequestSchema = new Schema<IEnrollmentRequest>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(EnrollmentRequestStatus),
      default: EnrollmentRequestStatus.PENDING,
    },
    requestedAt: {
      type: Date,
      default: Date.now,
    },
    reason: {
      type: String,
    },
  },
  { timestamps: true }
);

const EnrollmentRequestModel =
  mongoose.models.EnrollmentRequest ||
  mongoose.model("EnrollmentRequest", enrollmentRequestSchema);

export default EnrollmentRequestModel;
