import { Category } from "./category";

export interface Course {
  _id: string;
  name: string;
  description: string;
  image: {
    url: string;
    fileId: string;
  };
  categories: Array<Category>;
  isVisible: boolean;
  createdAt: Date;
  updatedAt: Date;
}
