// src/lib/validations.ts
import { z } from "zod";

export const resumeAnalysisSchema = z.object({
  jobTitle: z
    .string()
    .min(1, "Job title is required")
    .min(3, "Job title must be at least 3 characters")
    .max(100, "Job title must be less than 100 characters"),

  jobLevel: z
    .string()
    .min(1, "Job level is required")
    .min(5, "Job level must be at least 5 characters")
    .max(50, "Job level must be less than 50 characters"),

  jobRequirements: z
    .string()
    .min(1, "Job requirements are required")
    .min(50, "Job requirements must be at least 50 characters")
    .max(5000, "Job requirements must be less than 5000 characters"),

  jobDescription: z
    .string()
    .min(1, "Job description is required")
    .min(50, "Job description must be at least 50 characters")
    .max(5000, "Job description must be less than 5000 characters"),

  language: z.enum(["indonesia", "english"], {
    required_error: "Please select a language",
    invalid_type_error: "Please select a valid language",
  }),

  aiModel: z.enum(
    [
      "mistralai/mistral-7b-instruct:free",
      "deepseek/deepseek-r1-0528:free",
      "qwen/qwen3-235b-a22b:free",
      "google/gemini-2.0-flash-exp:free",
      "openai/gpt-oss-20b:free",
    ],
    {
      required_error: "Please select an AI model",
      invalid_type_error: "Please select a valid AI model",
    },
  ),
});

export const fileValidationSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size > 0, "Please select a file")
    .refine(
      (file) => file.size <= 10 * 1024 * 1024,
      "File size must be less than 10MB",
    )
    .refine(
      (file) => file.type === "application/pdf",
      "Only PDF files are allowed",
    ),
});

// Enhanced feedback interface
export interface EnhancedFeedbackData {
  score: number;
  strengths: string[];
  weaknesses: string[];
  summary: string;
  skillsMatch?: {
    matched: string[];
    missing: string[];
    percentage: number;
  };
  experienceAnalysis?: {
    relevantYears: number;
    industryMatch: boolean;
    careerProgression: "excellent" | "good" | "needs_improvement";
  };
  recommendations?: string[];
  keywordAnalysis?: {
    found: string[];
    missing: string[];
    density: number;
  };
  atsScore?: number;
  competitiveness?: "high" | "medium" | "low";
}

export type ResumeAnalysisFormData = z.infer<typeof resumeAnalysisSchema>;
export type FileValidationData = z.infer<typeof fileValidationSchema>;
