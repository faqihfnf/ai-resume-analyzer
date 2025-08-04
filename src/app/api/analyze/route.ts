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
        {
          error:
            "Could not extract text from PDF. Please ensure the PDF contains readable text.",
        },
        { status: 400 },
      );
    }

    console.log("🤖 Analyzing resume with AI...");
    console.log(`📊 Resume text length: ${resumeText.length} characters`);

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

    // Truncate resume text if too long to prevent token limit issues
    const maxResumeLength = 3000;
    const truncatedResumeText =
      resumeText.length > maxResumeLength
        ? resumeText.substring(0, maxResumeLength) + "..."
        : resumeText;

    // Buat prompt untuk AI yang lebih sederhana dan fokus
    const prompt = `
Analyze this resume against the job requirements. Be STRICT and REALISTIC in your scoring. Avoid round numbers like 60, 65, 70, 75, 80, 85. Use specific scores like 43, 67, 72, 89, etc.

SCORING GUIDELINES:
- Complete mismatch (different industry/role): 8-28
- Some transferable skills but wrong field: 29-47  
- Same field, missing key requirements: 48-67
- Good match with minor gaps: 68-84
- Excellent match: 85-97

Job Details:
- Title: ${jobTitle}
- Level: ${jobLevel}
- Requirements: ${jobRequirements}
- Description: ${jobDescription}

Resume Content:
${truncatedResumeText}

Respond with ONLY valid JSON in ${selectedLanguage.promptLanguage}. Use REALISTIC, non-round numbers for all scores:
{
  "score": <precise number like 43, 67, 72, 89 - NOT 60, 65, 70, 75>,
  "summary": "<honest assessment in ${selectedLanguage.promptLanguage}>",
  "strengths": ["<strength1>", "<strength2>", "<strength3>"],
  "weaknesses": ["<weakness1>", "<weakness2>", "<weakness3>"],
  "skillsMatch": {
    "matched": ["<skill1>", "<skill2>"],
    "missing": ["<missing1>", "<missing2>"],
    "percentage": <realistic percentage like 34, 58, 73 - NOT multiples of 5>
  },
  "keywordAnalysis": {
    "found": ["<keyword1>", "<keyword2>"],
    "missing": ["<missing1>", "<missing2>"],
    "density": <realistic density like 27, 41, 58 - NOT round numbers>
  },
  "recommendations": ["<rec1>", "<rec2>", "<rec3>"],
  "atsScore": <realistic ATS score like 46, 71, 83 - NOT multiples of 5>,
  "competitiveness": "<honest: high|medium|low>",
  "experienceAnalysis": {
    "relevantYears": <realistic years like 2.5, 3.2, 1.8>,
    "industryMatch": <true only if truly same industry>,
    "careerProgression": "<honest assessment>"
  }
}`;

    // Analyze dengan error handling yang lebih baik
    let analysis;
    try {
      analysis = await analyzeResumeWithAI(prompt);
      console.log("✅ Analysis completed successfully");
    } catch (aiError) {
      console.error("❌ AI Analysis failed:", aiError);

      // Jika AI analysis gagal, analysis sudah otomatis menggunakan fallback
      // dari function analyzeResumeWithAI, jadi kita tidak perlu handle di sini
      analysis = await analyzeResumeWithAI(prompt);
    }

    // Validasi final result
    if (!analysis || typeof analysis.score !== "number") {
      console.error("❌ Invalid analysis result:", analysis);
      return NextResponse.json(
        {
          error:
            "Analysis completed but result format is invalid. Please try again.",
          details: "The AI service returned an unexpected response format.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json(analysis);
  } catch (error) {
    console.error("❌ Error while processing resume:", error);

    // Return error response dengan detail yang lebih spesifik
    if (error instanceof Error) {
      // Check for specific error types
      if (error.message.includes("PDF")) {
        return NextResponse.json(
          {
            error:
              "Failed to process PDF file. Please ensure the file is not corrupted and contains readable text.",
          },
          { status: 400 },
        );
      }

      if (error.message.includes("AI") || error.message.includes("OpenAI")) {
        return NextResponse.json(
          {
            error:
              "AI analysis service is temporarily unavailable. Please try again later.",
          },
          { status: 503 },
        );
      }

      return NextResponse.json(
        { error: `Processing failed: ${error.message}` },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 },
    );
  }
}
