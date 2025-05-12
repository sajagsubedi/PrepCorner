import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  description: z.string().min(1, "Category Description is required"),
});

export type CategoryInput = z.infer<typeof categorySchema>;
