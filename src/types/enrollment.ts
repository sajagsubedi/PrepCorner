export enum EnrollmentStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

export interface EnrollmentRequest {
  _id: string;
  user: {
    fullName: string;
    email: string;
    profilePicture: {
      url: string;
    };
  };
  course: { name: string; description: string };
  requestedAt: string;
  status: EnrollmentStatus;
  reason?: string;
}

export interface Statistics {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}
