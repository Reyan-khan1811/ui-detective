import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config({ path: ".env.local" });

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.static("dist"));

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

app.get("/", (req, res) => {
  res.json({
    message: "UI Detective backend is running",
  });
});

// ==========================================
// 1. ANALYZE UI
// ==========================================

app.post("/api/analyze", async (req, res) => {
  try {
    const { imageBase64, mimeType } = req.body;

    if (!imageBase64) {
      return res.status(400).json({
        error: "No image provided",
      });
    }

    const response = await ai.models.generateContent({
      model: "gemma-4-26b-a4b-it",

      config: {
        responseMimeType: "application/json",

        responseSchema: {
          type: "object",
          properties: {
            uiElements: {
              type: "array",
              items: { type: "string" },
            },

            layout: {
              type: "object",
              properties: {
                description: { type: "string" },
                sections: {
                  type: "array",
                  items: { type: "string" },
                },
              },
            },

            colors: {
              type: "array",
              items: { type: "string" },
            },

            typography: {
              type: "object",
              properties: {
                heading: { type: "string" },
                body: { type: "string" },
                notes: { type: "string" },
              },
            },

            buttons: {
              type: "array",
              items: { type: "string" },
            },

            navigation: {
              type: "array",
              items: { type: "string" },
            },

            cardsOrSections: {
              type: "array",
              items: { type: "string" },
            },

            accessibilityIssues: {
              type: "array",
              items: { type: "string" },
            },

            suggestions: {
              type: "array",
              items: { type: "string" },
            },
          },
        },
      },

      contents: [
        {
          inlineData: {
            mimeType: mimeType || "image/png",
            data: imageBase64,
          },
        },

        {
          text: `
You are UI Detective, an AI tool that analyzes website screenshots.

Analyze the provided website screenshot.

Return ONLY valid JSON.
Do not use markdown.
Do not add explanations before or after the JSON.

Use exactly this structure:

{
  "uiElements": [],
  "layout": {
    "description": "",
    "sections": []
  },
  "colors": [],
  "typography": {
    "heading": "",
    "body": "",
    "notes": ""
  },
  "buttons": [],
  "navigation": [],
  "cardsOrSections": [],
  "accessibilityIssues": [],
  "suggestions": []
}

Rules:
- uiElements: list the visible UI elements.
- layout.description: describe the overall layout.
- layout.sections: list major page sections.
- colors: list important visible colors and their usage.
- typography: describe visible typography.
- buttons: list visible buttons and their purpose if identifiable.
- navigation: list visible navigation items.
- cardsOrSections: list cards or major content sections.
- accessibilityIssues: only mention issues that can reasonably be inferred from the screenshot.
- suggestions: give practical UI improvement suggestions.
- Do not invent information that cannot be reasonably inferred from the screenshot.
          `,
        },
      ],
    });

 const text = response.text.trim();
const jsonStart = text.indexOf("{");
const jsonEnd = text.lastIndexOf("}");

if (jsonStart === -1 || jsonEnd === -1) {
  throw new Error("Gemma did not return valid JSON");
}

const analysis = JSON.parse(text.slice(jsonStart, jsonEnd + 1));

    res.json({
      analysis,
    });
  } catch (error) {
    console.error("Gemma analysis error:", error);

    res.status(500).json({
      error: "Failed to analyze the UI",
    });
  }
});

// ==========================================
// 2. GENERATE REACT CODE
// ==========================================

app.post("/api/generate-code", async (req, res) => {
  try {
    const { analysis } = req.body;

    if (!analysis) {
      return res.status(400).json({
        error: "No UI analysis provided",
      });
    }

    const response = await ai.models.generateContent({
      model: "gemma-4-26b-a4b-it",

      contents: [
        {
          text: `
You are an expert React developer.

UI Detective has analyzed a website screenshot.

Your job is to generate React code that recreates the UI described by the analysis.

Here is the UI analysis:

${JSON.stringify(analysis, null, 2)}

Requirements:

1. Generate a complete React component.
2. Use functional React components.
3. Use JSX.
4. Use normal CSS classes.
5. Do not use external UI libraries.
6. Do not use Tailwind.
7. Do not use markdown code fences.
8. Do not add explanations before or after the code.
9. Keep the code clean and readable.
10. Use placeholder images if the screenshot contains images.
11. Recreate the layout, colors, typography, buttons and navigation described in the analysis.
12. Make the UI responsive.
13. Return ONLY the React JSX code.

The output should be directly usable inside a React project.
          `,
        },
      ],
    });

    res.json({
      code: response.text,
    });
  } catch (error) {
    console.error("Gemma code generation error:", error);

    res.status(500).json({
      error: "Failed to generate React code",
    });
  }
});

// ==========================================
// START SERVER
// ==========================================

app.listen(PORT, () => {
  console.log(
    `UI Detective backend running on http://localhost:${PORT}`
  );
});

