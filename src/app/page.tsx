"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ProgressCircle } from "@/components/ui/progress-circle"; // custom komponen
import { Loader2 } from "lucide-react";

export default function HomePage() {
  const [jobTitle, setJobTitle] = useState("");
  const [jobLevel, setJobLevel] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{
    score: number;
    strengths: string[];
    weaknesses: string[];
    summary: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setFeedback(null);

    const formData = new FormData();
    formData.append("jobTitle", jobTitle);
    formData.append("jobLevel", jobLevel);
    formData.append("jobDescription", jobDescription);
    formData.append("resume", file);

    const res = await fetch("/api/analyze", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setFeedback(data);
    setLoading(false);
  };

  return (
    <main className="mx-auto max-w-3xl space-y-6 px-4 py-10">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>Job Title</Label>
          <Input
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <Label>Job Level</Label>
          <Input
            value={jobLevel}
            onChange={(e) => setJobLevel(e.target.value)}
            required
          />
        </div>
        <div>
          <Label>Job Description</Label>
          <Textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <Label>Upload Resume (PDF only)</Label>
          <Input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            required
          />
        </div>
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Analyze Resume
        </Button>
      </form>

      {feedback && (
        <div className="mt-10 space-y-6">
          <div className="flex items-center justify-center">
            <ProgressCircle value={feedback.score} />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">Summary</h3>
            <p>{feedback.summary}</p>
          </div>
          <div>
            <h4 className="font-semibold">Strengths</h4>
            <ul className="list-disc pl-6">
              {feedback.strengths.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold">Weaknesses</h4>
            <ul className="list-disc pl-6">
              {feedback.weaknesses.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </main>
  );
}
