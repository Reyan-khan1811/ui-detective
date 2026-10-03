import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});

export async function analyzeUI(imageBase64) {
  const response = await ai.models.generateContent({
   model: "gemma-4-26b-a4b-it",
    contents: [
      {
        inlineData: {
          mimeType: "image/png",
          data: imageBase64,
        },
      },
      {
        text: `
You are UI Detective, an AI tool that analyzes website screenshots.

Analyze the provided screenshot and identify:

1. UI elements
2. Overall layout
3. Colors
4. Typography
5. Buttons and interactive elements
6. Navigation
7. Cards or sections
8. Possible accessibility issues
9. Suggestions for improving the UI

Return the analysis in a clear, structured format.
        `,
      },
    ],
  });

  return response.text;
}