import { Category } from "./category";

export enum courseStatus {
  ENROLLED = "enrolled",
  PENDING = "pending",
  NOTREQUESTED = "not_requested",
  REJECTED = "rejected",
}

export interface Course {
  _id: string;
  name: string;
  description: string;
  image: {
    url: string;
    fileId: string;
  };
  categories?: Array<Category>;
  enrollmentStatus?: courseStatus;
  isVisible: boolean;
  createdAt: Date;
  updatedAt: Date;
  categoriesCount?: number;
  date?: Date;
}
