import { Answer, Question } from "@/types/question";
import { z } from "zod";

const VALID_IMAGE_TYPES = ["image/png"];

// Zod schema for multiple image inputs
export const multipleImageSchema = z.array(
  z
    .instanceof(File)
    .refine(
      (file) => VALID_IMAGE_TYPES.includes(file.type),
      (file) => ({
        message: `Invalid image type for file '${
          file.name
        }'. Allowed types: ${VALID_IMAGE_TYPES.join(", ")}`,
      })
    )
    .refine(
      (file) => file.size <= 20 * 1024 * 1024,
      (file) => ({
        message: `File '${file.name}' exceeds 5MB`,
      })
    )
);
export const questionBulkSchema = z.object({
  images: multipleImageSchema,
  questions: z
    .string()
    .refine(
      (val) => {
        try {
          const parsed = JSON.parse(val);
          return Array.isArray(parsed);
        } catch {
          return false;
        }
      },
      {
        message: "Questions must be a valid JSON array",
      }
    )
    .refine(
      (val) => {
        try {
          const parsed = JSON.parse(val);
          return parsed.every(
            (q: Question) =>
              Array.isArray(q.answers) &&
              q.answers.every((a: Answer) => typeof a.answer === "string") &&
              (typeof q.correctAnswer === "number" ||
                typeof q.correctAnswer === "string")
          );
        } catch {
          return false;
        }
      },
      {
        message:
          "Each question must have a body, answers[{answer}], and correctAnswer",
      }
    ),
});

export const questionSchema = z.object({
  images: multipleImageSchema,
  body: z.string().min(1, "Question body is required").trim(),
  answers: z
    .array(
      z.object({
        answer: z.string().min(1, "Answer is required").trim(),
      })
    )
    .length(4, "Exactly four answers are required"),
  correctAnswer: z
    .number()
    .int()
    .min(0, "Correct answer index must be between 0 and 3")
    .max(3, "Correct answer index must be between 0 and 3"),
});

export type questionBulkInput = z.infer<typeof questionBulkSchema>;
export type questionInput = z.infer<typeof questionSchema>;
