"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Upload, FileText, Briefcase, User, AlertCircle } from "lucide-react";
import {
  resumeAnalysisSchema,
  fileValidationSchema,
  ResumeAnalysisFormData,
} from "@/lib/validations";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ResumeFormProps {
  onSubmit: (data: ResumeAnalysisFormData, file: File) => void;
  loading: boolean;
}

export function ResumeForm({ onSubmit, loading }: ResumeFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ResumeAnalysisFormData>({
    resolver: zodResolver(resumeAnalysisSchema),
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setFileError("");

    if (selectedFile) {
      try {
        fileValidationSchema.parse({ file: selectedFile });
        setFile(selectedFile);
      } catch (error: any) {
        setFileError(error.errors[0]?.message || "Invalid file");
        setFile(null);
      }
    } else {
      setFile(null);
    }
  };

  const onFormSubmit = (data: ResumeAnalysisFormData) => {
    if (!file) {
      setFileError("Please select a PDF file");
      return;
    }
    onSubmit(data, file);
  };

  const handleReset = () => {
    reset();
    setFile(null);
    setFileError("");
  };

  return (
    <Card className="mx-auto w-full max-w-2xl border-0 bg-gradient-to-br from-white to-slate-50 py-10 shadow-2xl dark:from-slate-900 dark:to-slate-800">
      <CardHeader className="space-y-2 pb-8 text-center">
        {/* <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
          <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400" />
        </div> */}
        <CardTitle className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-4xl font-bold text-transparent">
          Resume Analyzer
        </CardTitle>
        <CardDescription className="text-lg text-slate-700 dark:text-slate-400">
          Upload your resume and job details to get AI-powered feedback
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
          {/* Job Title */}
          <div className="space-y-2">
            <Label
              htmlFor="jobTitle"
              className="flex items-center gap-2 text-sm font-semibold"
            >
              <Briefcase className="h-4 w-4 text-blue-500" />
              Job Title
            </Label>
            <Input
              id="jobTitle"
              placeholder="e.g. Senior Frontend Developer"
              {...register("jobTitle")}
              className="h-12 border-2 transition-colors focus:border-blue-500"
              disabled={loading}
            />
            {errors.jobTitle && (
              <p className="flex items-center gap-1 text-sm text-red-500">
                <AlertCircle className="h-4 w-4" />
                {errors.jobTitle.message}
              </p>
            )}
          </div>

          {/* Job Level */}
          <div className="space-y-2">
            <Label
              htmlFor="jobLevel"
              className="flex items-center gap-2 text-sm font-semibold"
            >
              <User className="h-4 w-4 text-green-500" />
              Job Level
            </Label>
            <Input
              id="jobLevel"
              placeholder="e.g. Senior Level, Mid Level, Entry Level"
              {...register("jobLevel")}
              className="h-12 border-2 transition-colors focus:border-green-500"
              disabled={loading}
            />
            {errors.jobLevel && (
              <p className="flex items-center gap-1 text-sm text-red-500">
                <AlertCircle className="h-4 w-4" />
                {errors.jobLevel.message}
              </p>
            )}
          </div>

          {/* Job Description */}
          <div className="space-y-2">
            <Label
              htmlFor="jobDescription"
              className="flex items-center gap-2 text-sm font-semibold"
            >
              <FileText className="h-4 w-4 text-purple-500" />
              Job Description
            </Label>
            <Textarea
              id="jobDescription"
              placeholder="Paste the complete job description here..."
              {...register("jobDescription")}
              className="min-h-32 resize-none border-2 transition-colors focus:border-purple-500"
              disabled={loading}
            />
            {errors.jobDescription && (
              <p className="flex items-center gap-1 text-sm text-red-500">
                <AlertCircle className="h-4 w-4" />
                {errors.jobDescription.message}
              </p>
            )}
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <Label
              htmlFor="resume"
              className="flex items-center gap-2 text-sm font-semibold"
            >
              <Upload className="h-4 w-4 text-lime-500" />
              Upload Resume (PDF only)
            </Label>
            <div className="relative">
              <Input
                id="resume"
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="h-10 border-2 border-dashed transition-colors file:rounded-md file:border-0 file:bg-lime-50 file:px-4 file:text-sm file:font-semibold file:text-lime-700 hover:file:bg-lime-100 focus:border-lime-500"
                disabled={loading}
              />
              {file && (
                <div className="mt-2 rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-900/20">
                  <p className="flex items-center gap-2 text-sm text-green-700 dark:text-green-300">
                    <FileText className="h-4 w-4" />
                    {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                </div>
              )}
            </div>
            {fileError && (
              <p className="flex items-center gap-1 text-sm text-red-500">
                <AlertCircle className="h-4 w-4" />
                {fileError}
              </p>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              disabled={loading || !file}
              className="h-12 flex-1 cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 font-semibold text-white shadow-lg transition-all duration-200 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl"
            >
              {loading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  AI Analyzing Resume...
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-6 w-6" />
                  Analyze Resume
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              disabled={loading}
              className="h-12 cursor-pointer border-2 px-6 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              Reset
            </Button>
          </div>
        </form>

        {loading && (
          <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800 dark:text-blue-200">
              Please wait while we analyze your resume. This may take a few
              moments...
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
