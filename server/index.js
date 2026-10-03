import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config({ path: ".env.local" });

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json({ limit: "10mb" }));

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

app.get("/", (req, res) => {
  res.json({
    message: "UI Detective backend is running",
  });
});

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

   const analysis = JSON.parse(response.text);

res.json({
  analysis,
});
  } catch (error) {
    console.error("Gemma error:", error);

    res.status(500).json({
      error: "Failed to analyze the UI",
    });
  }
});

app.listen(PORT, () => {
  console.log(`UI Detective backend running on http://localhost:${PORT}`);
});