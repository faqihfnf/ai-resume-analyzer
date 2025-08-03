import { NextRequest, NextResponse } from "next/server";
import { extractTextFromPDF } from "@/lib/pdf";
import { analyzeResumeWithAI } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const jobTitle = formData.get("jobTitle") as string;
    const jobLevel = formData.get("jobLevel") as string;
    const jobRequirements = formData.get("jobRequirements") as string;
    const jobDescription = formData.get("jobDescription") as string;
    const language = formData.get("language") as string;
    const file = formData.get("resume") as File;

    // Validasi input
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (
      !jobTitle ||
      !jobLevel ||
      !jobRequirements ||
      !jobDescription ||
      !language
    ) {
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

    // Validasi bahasa
    if (!["indonesia", "english"].includes(language)) {
      return NextResponse.json(
        { error: "Invalid language selection" },
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

    // Tentukan bahasa untuk prompt dan feedback
    const languageInstructions = {
      indonesia: {
        promptLanguage: "Bahasa Indonesia",
        instruction:
          "Berikan feedback dalam Bahasa Indonesia yang jelas dan mudah dipahami.",
      },
      english: {
        promptLanguage: "English",
        instruction: "Provide feedback in clear and professional English.",
      },
    };

    const selectedLanguage =
      languageInstructions[language as keyof typeof languageInstructions];

    // Buat prompt untuk AI
    const prompt = `
Analyze this resume against the job requirements and provide feedback in JSON format. ${selectedLanguage.instruction}

Job Title: ${jobTitle}
Job Level: ${jobLevel}
Job Requirements: ${jobRequirements}
Job Description: ${jobDescription}

Resume Content:
${resumeText}

Please provide analysis in this exact JSON format and respond in ${selectedLanguage.promptLanguage}:
{
  "score": <number between 0-100>,
  "summary": "<brief summary of the resume match in ${selectedLanguage.promptLanguage}>",
  "strengths": ["<strength 1 in ${selectedLanguage.promptLanguage}>", "<strength 2 in ${selectedLanguage.promptLanguage}>", "<strength 3 in ${selectedLanguage.promptLanguage}>"],
  "weaknesses": ["<weakness 1 in ${selectedLanguage.promptLanguage}>", "<weakness 2 in ${selectedLanguage.promptLanguage}>", "<weakness 3 in ${selectedLanguage.promptLanguage}>"]
}

Focus on:
1. Relevant experience and skills
2. Match with job requirements  
3. Career progression
4. Technical skills alignment
5. Education relevance
6. Keywords matching
7. Overall presentation

Important: All text content in the JSON response must be in ${selectedLanguage.promptLanguage}.
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
