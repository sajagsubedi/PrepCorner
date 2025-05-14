import { z } from "zod";

export const questionSetSchema = z.object({
  name: z.string().min(1, "Category name is required"),
  duration: z.number(),
});

export type QuestionSetInput = z.infer<typeof questionSetSchema>;
