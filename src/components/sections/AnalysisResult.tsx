"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TrendingUp,
  TrendingDown,
  FileText,
  Award,
  AlertTriangle,
  Target,
  BookOpen,
  Lightbulb,
  Download,
  Share2,
  CheckCircle,
  XCircle,
  Users,
  Brain,
  Zap,
  Star,
  TrendingUpIcon,
  ShieldHalf,
  X,
} from "lucide-react";

interface AnalysisResultProps {
  feedback: {
    score: number;
    strengths: string[];
    weaknesses: string[];
    summary: string;
    // Enhanced fields
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
  };
}

export function AnalysisResult({ feedback }: AnalysisResultProps) {
  const [activeTab, setActiveTab] = useState("overview");

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
    if (score >= 70) return "Good Match";
    if (score >= 60) return "Fair Match";
    return "Needs Improvement";
  };

  const getCompetitivenessColor = (level: string) => {
    switch (level) {
      case "high":
        return "text-green-600 bg-green-100 dark:bg-green-900";
      case "medium":
        return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900";
      case "low":
        return "text-red-600 bg-red-100 dark:bg-red-900";
      default:
        return "text-gray-600 bg-gray-100 dark:bg-gray-900";
    }
  };

  return (
    <div className="animate-in slide-in-from-bottom-4 mx-auto w-full max-w-6xl space-y-6 duration-500">
      {/* Header dengan Score dan Actions */}
      <Card className="border-0 bg-gradient-to-br from-white to-gray-50 shadow-2xl dark:from-gray-900 dark:to-gray-800">
        <CardHeader className="pb-6">
          <div className="flex flex-col items-center justify-between gap-6 lg:flex-row">
            {/* Score Circle */}
            <div className="flex items-center gap-8">
              <div
                className={`relative h-40 w-40 rounded-full ${getScoreBgColor(feedback.score)} flex items-center justify-center shadow-inner`}
              >
                <div className="text-center">
                  <div
                    className={`text-2xl font-bold ${getScoreColor(feedback.score)}`}
                  >
                    {feedback.score} <span className="text-indigo-900">/ </span>
                    100
                  </div>
                  {/* <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    / 100
                  </div> */}
                </div>
                <svg
                  className="absolute inset-0 h-40 w-40 -rotate-90 transform"
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

              {/* Score Details */}
              <div className="space-y-2">
                <h3 className="bg-gradient-to-tl from-indigo-700 via-violet-600 to-purple-500 bg-clip-text fill-transparent text-2xl font-bold text-transparent">
                  Your Resume Analysis
                </h3>
                <p className="text-md text-gray-700 dark:text-gray-300">
                  This score reflects how well your resume matches the job
                  requirements based on AI analysis.
                </p>
                <Badge variant="secondary" className="px-4 py-2 text-sm">
                  <Award className="mr-2 h-4 w-4" />
                  {getScoreText(feedback.score)}
                </Badge>
                {feedback.atsScore && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">ATS Score:</span>
                    <Badge
                      variant="outline"
                      className={getScoreColor(feedback.atsScore)}
                    >
                      {feedback.atsScore}%
                    </Badge>
                  </div>
                )}
                {feedback.competitiveness && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">
                      Competitiveness:
                    </span>
                    <Badge
                      className={getCompetitivenessColor(
                        feedback.competitiveness,
                      )}
                    >
                      <ShieldHalf className="mr-1 h-3 w-3" />
                      {feedback.competitiveness.charAt(0).toUpperCase() +
                        feedback.competitiveness.slice(1)}
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Tabs for Different Views */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="gap-2">
            <FileText className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="skills" className="gap-2">
            <Brain className="h-4 w-4" />
            Skills
          </TabsTrigger>
          <TabsTrigger value="keywords" className="gap-2">
            <Target className="h-4 w-4" />
            Keywords
          </TabsTrigger>
          <TabsTrigger value="recommendations" className="gap-2">
            <Lightbulb className="h-4 w-4" />
            Tips
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Summary Card */}
          <Card className="border-0 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-xl dark:from-blue-900/20 dark:to-indigo-900/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <FileText className="h-5 w-5 text-blue-600" />
                <span className="mt-1 text-blue-600">Executive Summary</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-justify text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                {feedback.summary}
              </p>
            </CardContent>
          </Card>

          {/* Strengths & Weaknesses Grid */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Strengths Card */}
            <Card className="border-0 bg-gradient-to-br from-green-50 to-emerald-50 shadow-xl dark:from-green-900/20 dark:to-emerald-900/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl text-green-700 dark:text-green-400">
                  <TrendingUp className="h-5 w-5" />
                  Key Strengths
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
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-400" />
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
                    <XCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600 dark:text-red-400" />
                    <p className="leading-relaxed text-gray-700 dark:text-gray-300">
                      {weakness}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Skills Analysis Tab */}
        <TabsContent value="skills" className="space-y-6">
          {feedback.skillsMatch && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <Card className="shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-5 w-5" />
                    Matched Skills ({feedback.skillsMatch.matched.length})
                  </CardTitle>
                  <Progress
                    value={feedback.skillsMatch.percentage}
                    className="mt-2"
                  />
                  <p className="text-sm text-gray-600">
                    {feedback.skillsMatch.percentage}% skills match
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-2">
                    {feedback.skillsMatch.matched.map((skill, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 rounded-md bg-green-50 p-3 transition-colors hover:bg-green-100"
                      >
                        <div className="h-2 w-2 flex-shrink-0 rounded-full bg-green-500"></div>
                        <span className="font-medium text-green-900">
                          {skill}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-orange-600">
                    <AlertTriangle className="h-5 w-5" />
                    Missing Skills ({feedback.skillsMatch.missing.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-2">
                    {feedback.skillsMatch.missing.map((skill, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 rounded-md bg-orange-50 p-3 transition-colors hover:bg-orange-100"
                      >
                        <div className="h-2 w-2 flex-shrink-0 rounded-full bg-orange-500"></div>
                        <span className="font-medium text-orange-900">
                          {skill}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* Keywords Tab */}
        <TabsContent value="keywords" className="space-y-6">
          {feedback.keywordAnalysis && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <Card className="shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-600">
                    <Target className="h-5 w-5" />
                    Found Keywords
                  </CardTitle>
                  <p className="text-sm text-gray-600">
                    Keyword density: {feedback.keywordAnalysis.density}%
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {feedback.keywordAnalysis.found.map((keyword, index) => (
                      <Badge key={index} className="bg-blue-100 text-blue-800">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-600">
                    <XCircle className="h-5 w-5" />
                    Missing Keywords
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {feedback.keywordAnalysis.missing.map((keyword, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="border-red-200 text-red-700"
                      >
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* Recommendations Tab */}
        <TabsContent value="recommendations" className="space-y-6">
          {feedback.recommendations && (
            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 shadow-xl dark:from-purple-900/20 dark:to-pink-900/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-600">
                  <Lightbulb className="h-5 w-5" />
                  Actionable Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {feedback.recommendations.map((recommendation, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 rounded-lg border border-purple-200 bg-white/60 p-4 dark:border-purple-800 dark:bg-gray-800/60"
                  >
                    <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900">
                      <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
                        {index + 1}
                      </span>
                    </div>
                    <p className="leading-relaxed text-gray-700 dark:text-gray-300">
                      {recommendation}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
