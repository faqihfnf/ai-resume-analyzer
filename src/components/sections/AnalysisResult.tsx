"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  FileText,
  Award,
  AlertTriangle,
} from "lucide-react";

interface AnalysisResultProps {
  feedback: {
    score: number;
    strengths: string[];
    weaknesses: string[];
    summary: string;
  };
}

export function AnalysisResult({ feedback }: AnalysisResultProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 dark:text-green-400";
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return "bg-green-100 dark:bg-green-900";
    if (score >= 60) return "bg-yellow-100 dark:bg-yellow-900";
    return "bg-red-100 dark:bg-red-900";
  };

  const getScoreText = (score: number) => {
    if (score >= 80) return "Excellent Match";
    if (score >= 60) return "Good Match";
    return "Needs Improvement";
  };

  return (
    <div className="animate-in slide-in-from-bottom-4 mx-auto w-full max-w-4xl space-y-6 duration-500">
      {/* Score Card */}
      <Card className="border-0 bg-gradient-to-br from-white to-gray-50 shadow-2xl dark:from-gray-900 dark:to-gray-800">
        <CardHeader className="pb-4 text-center">
          <CardTitle className="mb-4 text-2xl font-bold">
            Analysis Results
          </CardTitle>
          <div className="flex items-center justify-center">
            <div
              className={`relative h-32 w-32 rounded-full ${getScoreBgColor(feedback.score)} flex items-center justify-center shadow-inner`}
            >
              <div className="text-center">
                <div
                  className={`text-4xl font-bold ${getScoreColor(feedback.score)}`}
                >
                  {feedback.score}
                </div>
                <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  / 100
                </div>
              </div>
              {/* Progress Ring */}
              <svg
                className="absolute inset-0 h-32 w-32 -rotate-90 transform"
                viewBox="0 0 100 100"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-gray-200 dark:text-gray-700"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${feedback.score * 2.83} 283`}
                  className={getScoreColor(feedback.score)}
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
          <Badge variant="secondary" className="mt-4 px-4 py-2 text-sm">
            <Award className="mr-2 h-4 w-4" />
            {getScoreText(feedback.score)}
          </Badge>
        </CardHeader>
      </Card>

      {/* Summary Card */}
      <Card className="border-0 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-xl dark:from-blue-900/20 dark:to-indigo-900/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <FileText className="h-5 w-5 text-blue-600" />
            Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
            {feedback.summary}
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Strengths Card */}
        <Card className="border-0 bg-gradient-to-br from-green-50 to-emerald-50 shadow-xl dark:from-green-900/20 dark:to-emerald-900/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl text-green-700 dark:text-green-400">
              <TrendingUp className="h-5 w-5" />
              Strengths
              <Badge variant="secondary" className="ml-auto">
                {feedback.strengths.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {feedback.strengths.map((strength, index) => (
              <div
                key={index}
                className="flex items-start gap-3 rounded-lg border border-green-200 bg-white/60 p-3 dark:border-green-800 dark:bg-gray-800/60"
              >
                <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                  <div className="h-2 w-2 rounded-full bg-green-600 dark:bg-green-400"></div>
                </div>
                <p className="leading-relaxed text-gray-700 dark:text-gray-300">
                  {strength}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Weaknesses Card */}
        <Card className="border-0 bg-gradient-to-br from-red-50 to-rose-50 shadow-xl dark:from-red-900/20 dark:to-rose-900/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl text-red-700 dark:text-red-400">
              <TrendingDown className="h-5 w-5" />
              Areas for Improvement
              <Badge variant="secondary" className="ml-auto">
                {feedback.weaknesses.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {feedback.weaknesses.map((weakness, index) => (
              <div
                key={index}
                className="flex items-start gap-3 rounded-lg border border-red-200 bg-white/60 p-3 dark:border-red-800 dark:bg-gray-800/60"
              >
                <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
                  <AlertTriangle className="h-3 w-3 text-red-600 dark:text-red-400" />
                </div>
                <p className="leading-relaxed text-gray-700 dark:text-gray-300">
                  {weakness}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
