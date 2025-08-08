import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    "X-Title": "Resume Analyzer",
  },
});

interface AnalysisResult {
  score: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  skillsMatch: {
    matched: string[];
    missing: string[];
    percentage: number;
  };
  keywordAnalysis: {
    found: string[];
    missing: string[];
    density: number;
  };
  recommendations: string[];
  atsScore: number;
  competitiveness: "high" | "medium" | "low";
  experienceAnalysis: {
    relevantYears: number;
    industryMatch: boolean;
    careerProgression: "excellent" | "good" | "needs_improvement";
  };
}

// Simplified: Only model selection, same settings for all models
const DEFAULT_SETTINGS = {
  temperature: 0.5,
  maxTokens: 2000,
  systemPrompt:
    "You are a professional resume analyst. You MUST respond with ONLY a valid JSON object. Do not include any explanations, markdown, or text outside the JSON. The JSON must be properly formatted and contain all required fields.",
};

function cleanJson(str: string): string {
  // Remove any text before the first {
  let cleaned = str.replace(/^[^{]*/, "");

  // Remove any text after the last }
  const lastBraceIndex = cleaned.lastIndexOf("}");
  if (lastBraceIndex !== -1) {
    cleaned = cleaned.substring(0, lastBraceIndex + 1);
  }

  // Fix common JSON formatting issues
  cleaned = cleaned
    .replace(/,\s*}/g, "}") // Remove trailing commas in objects
    .replace(/,\s*]/g, "]") // Remove trailing commas in arrays
    .replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2":') // Fix unquoted keys
    .replace(/:\s*'([^']*)'/g, ': "$1"') // Replace single quotes with double quotes
    .replace(/\\n/g, "\\n") // Ensure newlines are properly escaped
    .replace(/\\t/g, "\\t") // Ensure tabs are properly escaped
    .trim();

  return cleaned;
}

function extractJson(text: string): AnalysisResult | null {
  try {
    // First, try to parse the raw response
    const parsed = JSON.parse(text);
    if (isValidAnalysisResult(parsed)) {
      return parsed;
    }
  } catch (e) {
    // If that fails, try cleaning the JSON
    try {
      const cleaned = cleanJson(text);
      const parsed = JSON.parse(cleaned);
      if (isValidAnalysisResult(parsed)) {
        return parsed;
      }
    } catch (e2) {
      console.error("Failed to parse cleaned JSON:", e2);
    }
  }

  // Try to extract JSON using regex as last resort
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      const cleaned = cleanJson(jsonMatch[0]);
      const parsed = JSON.parse(cleaned);
      if (isValidAnalysisResult(parsed)) {
        return parsed;
      }
    } catch (e3) {
      console.error("Failed to parse regex extracted JSON:", e3);
    }
  }

  return null;
}

function isValidAnalysisResult(obj: any): obj is AnalysisResult {
  return (
    obj &&
    typeof obj === "object" &&
    typeof obj.score === "number" &&
    typeof obj.summary === "string" &&
    Array.isArray(obj.strengths) &&
    Array.isArray(obj.weaknesses) &&
    obj.skillsMatch &&
    Array.isArray(obj.skillsMatch.matched) &&
    Array.isArray(obj.skillsMatch.missing) &&
    typeof obj.skillsMatch.percentage === "number" &&
    obj.keywordAnalysis &&
    Array.isArray(obj.keywordAnalysis.found) &&
    Array.isArray(obj.keywordAnalysis.missing) &&
    typeof obj.keywordAnalysis.density === "number" &&
    Array.isArray(obj.recommendations) &&
    typeof obj.atsScore === "number" &&
    typeof obj.competitiveness === "string" &&
    obj.experienceAnalysis &&
    typeof obj.experienceAnalysis.relevantYears === "number" &&
    typeof obj.experienceAnalysis.industryMatch === "boolean" &&
    typeof obj.experienceAnalysis.careerProgression === "string"
  );
}

function createFallbackResult(
  language: string,
  modelUsed: string,
): AnalysisResult {
  const isIndonesian = language === "indonesia";

  return {
    score: 65,
    summary: isIndonesian
      ? `Analisis resume tidak dapat diselesaikan sepenuhnya dengan model ${getModelDisplayName(modelUsed)}, namun resume menunjukkan potensi yang baik dengan beberapa area yang perlu diperbaiki.`
      : `Resume analysis could not be completed fully with ${getModelDisplayName(modelUsed)}, but the resume shows good potential with some areas for improvement.`,
    strengths: isIndonesian
      ? [
          "Format resume dapat dibaca",
          "Informasi kontak tersedia",
          "Pengalaman kerja tercantum",
          "Pendidikan formal ada",
        ]
      : [
          "Resume format is readable",
          "Contact information available",
          "Work experience listed",
          "Education background present",
        ],
    weaknesses: isIndonesian
      ? [
          "Perlu optimasi kata kunci",
          "Deskripsi pencapaian kurang detail",
          "Skills perlu diperjelas",
          "Format bisa lebih baik",
        ]
      : [
          "Needs keyword optimization",
          "Achievement descriptions lack detail",
          "Skills need clarification",
          "Format could be improved",
        ],
    skillsMatch: {
      matched: ["Communication", "Teamwork", "Problem Solving"],
      missing: ["Technical Skills", "Industry Knowledge"],
      percentage: 60,
    },
    keywordAnalysis: {
      found: ["Experience", "Education", "Skills"],
      missing: ["Industry Keywords", "Technical Terms"],
      density: 45,
    },
    recommendations: isIndonesian
      ? [
          "Tambahkan kata kunci yang relevan dengan posisi",
          "Perjelas pencapaian dengan angka konkret",
          "Sesuaikan format untuk ATS compatibility",
          "Tambahkan skills teknis yang dibutuhkan",
          "Perbaiki struktur dan tata letak resume",
        ]
      : [
          "Add relevant keywords for the position",
          "Clarify achievements with concrete numbers",
          "Adjust format for ATS compatibility",
          "Add required technical skills",
          "Improve resume structure and layout",
        ],
    atsScore: 70,
    competitiveness: "medium",
    experienceAnalysis: {
      relevantYears: 2,
      industryMatch: false,
      careerProgression: "needs_improvement",
    },
  };
}

function getModelDisplayName(modelId: string): string {
  const modelNames: Record<string, string> = {
    "mistralai/mistral-7b-instruct:free": "Mistral",
    "deepseek/deepseek-r1-0528:free": "DeepSeek",
    "qwen/qwen3-235b-a22b:free": "Qwen",
    "google/gemini-2.0-flash-exp:free": "Gemini",
    "openai/gpt-oss-20b:free": "OpenAI GPT",
  };
  return modelNames[modelId] || modelId;
}

export async function analyzeResumeWithAI(
  prompt: string,
  selectedModel?: string, // Ubah ke optional parameter
): Promise<AnalysisResult> {
  const maxRetries = 3;
  let lastError: Error | null = null;

  // Extract language from prompt for fallback
  const language = prompt.includes("Bahasa Indonesia")
    ? "indonesia"
    : "english";

  // Set default hanya jika tidak ada selectedModel yang dikirim
  const modelToUse = selectedModel || "mistralai/mistral-7b-instruct:free";

  // Get default settings (same for all models)
  const config = DEFAULT_SETTINGS;

  console.log(`🤖 Using AI Model: ${getModelDisplayName(modelToUse)}`);
  console.log(`📝 Selected Model Parameter: ${selectedModel}`); // Debug log
  console.log(`🎯 Model To Use: ${modelToUse}`); // Debug log

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(
        `🔄 AI Analysis attempt ${attempt}/${maxRetries} with ${getModelDisplayName(modelToUse)}`,
      );

      const completion = await openai.chat.completions.create({
        model: modelToUse, // Pastikan menggunakan variable yang benar
        messages: [
          {
            role: "system",
            content: `${config.systemPrompt}
            
            Example of expected JSON structure:
            {
              "score": 75,
              "summary": "Brief analysis summary",
              "strengths": ["strength1", "strength2"],
              "weaknesses": ["weakness1", "weakness2"],
              "skillsMatch": {
                "matched": ["skill1", "skill2"],
                "missing": ["missing1"],
                "percentage": 80
              },
              "keywordAnalysis": {
                "found": ["keyword1"],
                "missing": ["missing1"],
                "density": 60
              },
              "recommendations": ["rec1", "rec2"],
              "atsScore": 85,
              "competitiveness": "high",
              "experienceAnalysis": {
                "relevantYears": 3,
                "industryMatch": true,
                "careerProgression": "good"
              }
            }`,
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: config.temperature,
        max_tokens: config.maxTokens,
      });

      const responseText = completion.choices[0].message.content ?? "";
      console.log(
        `📋 Raw AI Response (attempt ${attempt}):`,
        responseText.substring(0, 200) + "...",
      );

      const result = extractJson(responseText);

      if (result) {
        console.log("✅ Successfully parsed AI response");
        return result;
      } else {
        throw new Error(`Invalid JSON format on attempt ${attempt}`);
      }
    } catch (error) {
      console.error(`❌ AI Analysis attempt ${attempt} failed:`, error);
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt === maxRetries) {
        console.log("🔄 All attempts failed, using fallback result");
        return createFallbackResult(language, modelToUse);
      }

      // Wait before retry (exponential backoff)
      await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
    }
  }

  // This should never be reached, but just in case
  return createFallbackResult(language, modelToUse);
}
