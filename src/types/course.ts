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
  createdAt: Date;
  updatedAt: Date;
}
