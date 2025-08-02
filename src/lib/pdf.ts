// src/lib/pdf.ts
import * as pdfjsLib from "pdfjs-dist";

// Set worker path for PDF.js
if (typeof window === "undefined") {
  // Server-side
  pdfjsLib.GlobalWorkerOptions.workerSrc = require("pdfjs-dist/build/pdf.worker.min.js");
}

export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    // Convert Buffer to Uint8Array
    const uint8Array = new Uint8Array(buffer);

    // Load PDF document
    const loadingTask = pdfjsLib.getDocument({ data: uint8Array });
    const pdf = await loadingTask.promise;

    let fullText = "";

    // Extract text from each page
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();

      const pageText = textContent.items.map((item: any) => item.str).join(" ");

      fullText += pageText + "\n";
    }

    return fullText.trim();
  } catch (error) {
    console.error("❌ Failed to parse PDF:", error);
    throw new Error("Failed to extract text from PDF");
  }
}
