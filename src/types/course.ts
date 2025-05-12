export interface Course {
  _id: string;
  name: string;
  description: string;
  image: {
    url: string;
    fileId: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
