import { z } from "zod";

export const courseSchema = z.object({
  name: z.string().min(1, "Course name is required"),
  description: z.string().min(1, "Course Description is required"),
  image: z
    .instanceof(File, {
      message: "Course Image is required",
    })
    .optional(),
});

export type CourseInput = z.infer<typeof courseSchema>;
