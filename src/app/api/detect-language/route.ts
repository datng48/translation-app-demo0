import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    if (!text || text.trim() === "") {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const openAIKey = process.env.OPENAI_API_KEY;
    if (!openAIKey) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content:
                "You are a language detection system. You will be given a text, and you must detect what language it is written in. Respond with just the ISO language code (e.g., 'en' for English, 'es' for Spanish, 'fr' for French, 'vi' for Vietnamese). Only provide the language code, nothing else.",
            },
            {
              role: "user",
              content: text,
            },
          ],
          temperature: 0.3,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${openAIKey}`,
          },
        }
      );

      let detectedLanguage = response.data.choices[0].message.content
        .trim()
        .toLowerCase();

      if (detectedLanguage.includes(" ")) {
        detectedLanguage = detectedLanguage.split(" ")[0];
      }

      detectedLanguage = detectedLanguage.replace(/[^a-z]/g, "");

      return NextResponse.json({ detectedLanguage });
    } catch {
      return NextResponse.json({ error: "Error" }, { status: 503 });
    }
  } catch {
    return NextResponse.json(
      { error: "Failed to detect language" },
      { status: 500 }
    );
  }
}
