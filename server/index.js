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

Analyze the provided screenshot.

Identify:

1. UI elements
2. Overall layout
3. Colors
4. Typography
5. Buttons and interactive elements
6. Navigation
7. Cards or sections
8. Possible accessibility issues
9. Suggestions for improving the UI

Give a clear, structured analysis.
          `,
        },
      ],
    });

    res.json({
      analysis: response.text,
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