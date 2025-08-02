// src/app/api/analyze/route.ts
import { NextRequest, NextResponse } from "next/server";
import { extractTextFromPDF } from "@/lib/pdf";
import { analyzeResumeWithAI } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const jobTitle = formData.get("jobTitle") as string;
    const jobLevel = formData.get("jobLevel") as string;
    const jobDescription = formData.get("jobDescription") as string;
    const file = formData.get("resume") as File;

    // Validasi input
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (!jobTitle || !jobLevel || !jobDescription) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Validasi tipe file
    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files are allowed" },
        { status: 400 },
      );
    }

    // Extract text dari PDF
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    console.log("📄 Extracting text from PDF...");
    const resumeText = await extractTextFromPDF(buffer);

    if (!resumeText || resumeText.trim().length === 0) {
      return NextResponse.json(
        { error: "Could not extract text from PDF" },
        { status: 400 },
      );
    }

    console.log("🤖 Analyzing resume with AI...");

    // Buat prompt untuk AI
    const prompt = `
Analyze this resume against the job requirements and provide feedback in JSON format.

Job Title: ${jobTitle}
Job Level: ${jobLevel}
Job Description: ${jobDescription}

Resume Content:
${resumeText}

Please provide analysis in this exact JSON format:
{
  "score": <number between 0-100>,
  "summary": "<brief summary of the resume match>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "weaknesses": ["<weakness 1>", "<weakness 2>", "<weakness 3>"]
}

Focus on:
1. Relevant experience and skills
2. Match with job requirements
3. Career progression
4. Technical skills alignment
5. Education relevance
`;

    const analysis = await analyzeResumeWithAI(prompt);

    console.log("✅ Analysis completed");
    return NextResponse.json(analysis);
  } catch (error) {
    console.error("❌ Error while analyzing resume:", error);

    // Return error response dengan detail yang lebih spesifik
    if (error instanceof Error) {
      return NextResponse.json(
        { error: `Failed to process resume: ${error.message}` },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
