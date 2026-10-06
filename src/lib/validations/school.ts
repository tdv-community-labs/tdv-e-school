import { z } from "zod";

export const SubjectSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  shortName: z.string().optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
  accentColor: z.string().optional(),
  description: z.string().optional(),
  totalLessons: z.number().int().nonnegative().default(0),
  totalExams: z.number().int().nonnegative().default(0),
});

export const ExamFilterSchema = z.object({
  subjectId: z.string().optional(),
  grade: z.coerce.number().int().min(6).max(11).optional(),
  examType: z.enum(["BSQ", "KSQ"]).optional(),
  semester: z.coerce.number().int().min(1).max(2).optional(),
});

export const TutorQuerySchema = z.object({
  prompt: z.string().min(2, "Sual minimum 2 simvoldan ibarət olmalıdır."),
  subjectId: z.string().optional(),
  grade: z.number().int().min(6).max(11).optional(),
});

export const QuizSubmissionSchema = z.object({
  examId: z.string(),
  studentId: z.string(),
  answers: z.record(z.string(), z.string()),
  timeSpentSeconds: z.number().positive(),
});

export type SubjectInput = z.infer<typeof SubjectSchema>;
export type ExamFilterInput = z.infer<typeof ExamFilterSchema>;
export type TutorQueryInput = z.infer<typeof TutorQuerySchema>;
export type QuizSubmissionInput = z.infer<typeof QuizSubmissionSchema>;
