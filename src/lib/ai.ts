import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    "X-Title": "Resume Analyzer",
  },
});

function cleanJson(str: string): string {
  return str
    .replace(/^.*?(?=\{)/m, "")
    .replace(/\}.*$/m, "}")
    .replace(/,\s*}/g, "}")
    .replace(/,\s*]/g, "]");
}

function extractJson(text: string): any | null {
  try {
    const cleaned = cleanJson(text);
    return JSON.parse(cleaned);
  } catch (e) {
    console.error("Failed to parse AI response:", e);
    return null;
  }
}

export async function analyzeResumeWithAI(prompt: string) {
  try {
    const completion = await openai.chat.completions.create({
      model: "mistralai/mistral-7b-instruct:free",
      messages: [
        {
          role: "system",
          content:
            "You are a resume expert. Always respond in valid JSON format. Do not include any explanation or markdown. ",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.3,
    });

    const responseText = completion.choices[0].message.content ?? "";
    const json = extractJson(responseText);

    if (!json || typeof json.score !== "number") {
      throw new Error("Invalid response format");
    }

    return json;
  } catch (error) {
    console.error("AI error:", error);
    throw error;
  }
}
