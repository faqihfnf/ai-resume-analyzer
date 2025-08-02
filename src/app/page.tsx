"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles } from "lucide-react";
import { ResumeAnalysisFormData } from "@/lib/validations";
import { ResumeForm } from "@/components/sections/ResumeForm";
import { AnalysisResult } from "@/components/sections/AnalysisResult";

interface FeedbackData {
  score: number;
  strengths: string[];
  weaknesses: string[];
  summary: string;
}

export default function HomePage() {
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackData | null>(null);
  const [error, setError] = useState<string>("");

  const handleSubmit = async (data: ResumeAnalysisFormData, file: File) => {
    setLoading(true);
    setFeedback(null);
    setError("");

    try {
      const formData = new FormData();
      formData.append("jobTitle", data.jobTitle);
      formData.append("jobLevel", data.jobLevel);
      formData.append("jobDescription", data.jobDescription);
      formData.append("resume", file);

      const res = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to analyze resume");
      }

      const result = await res.json();
      setFeedback(result);
    } catch (err) {
      console.error("Analysis error:", err);
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleStartOver = () => {
    setFeedback(null);
    setError("");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-200 via-violet-100 to-pink-200 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-300">
            <Sparkles className="h-4 w-4" />
            AI-Powered Analysis
          </div>
          <h1 className="mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-4xl font-bold text-transparent md:text-6xl">
            Resumeaizer
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-gray-600 md:text-xl dark:text-gray-400">
            Get instant AI-powered feedback on your resume and improve your
            chances of landing your dream job
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mx-auto mb-8 max-w-2xl">
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-red-500"></div>
                <p className="font-medium text-red-700 dark:text-red-300">
                  Analysis Failed
                </p>
              </div>
              <p className="mt-2 text-red-600 dark:text-red-400">{error}</p>
              <Button
                onClick={handleStartOver}
                variant="outline"
                className="mt-3 border-red-200 text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-900/20"
              >
                Try Again
              </Button>
            </div>
          </div>
        )}

        {/* Main Content */}
        {!feedback ? (
          <ResumeForm onSubmit={handleSubmit} loading={loading} />
        ) : (
          <div className="space-y-8">
            {/* Back Button */}
            <div className="mx-auto max-w-4xl">
              <Button
                onClick={handleStartOver}
                variant="outline"
                className="mb-6 cursor-pointer border-2 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Analyze Another Resume
              </Button>
            </div>

            {/* Results */}
            <AnalysisResult feedback={feedback} />
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-16 border-t border-gray-200 bg-white/50 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/50">
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            &copy; {new Date().getFullYear()} Resume Analyzer. All rights
            reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
