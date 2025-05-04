import { NextResponse } from "next/server";
import axios from "axios";

interface ApiError {
  response?: {
    data?: Record<string, unknown>;
  };
  message?: string;
}

export async function POST(request: Request) {
  try {
    const { text, sourceLanguage, targetLanguage } = await request.json();

    if (!text || !sourceLanguage || !targetLanguage) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    const openAIKey = process.env.OPENAI_API_KEY;
    if (!openAIKey) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    try {
      const systemPrompt =
        sourceLanguage === "auto"
          ? `You are a professional translator. Detect the language of the provided text and translate it to ${targetLanguage}. Only respond with the translated text, no commentary, make the response concise and correct as possible`
          : `You are a professional translator. Translate the following text from ${sourceLanguage} to ${targetLanguage}. Only respond with the translated text, no commentary, make the response concise and correct as possible`;

      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: systemPrompt,
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

      const translatedText = response.data.choices[0].message.content.trim();

      return NextResponse.json({
        translatedText,
        id: Math.floor(Math.random() * 1000),
      });
    } catch (apiError: unknown) {
      const error = apiError as ApiError;
      console.error("OpenAI API error:", error.response?.data || error.message);
      return NextResponse.json(
        { error: "Translation service unavailable" },
        { status: 503 }
      );
    }
  } catch (error) {
    console.error("Translation error:", error);
    return NextResponse.json(
      { error: "Failed to translate text" },
      { status: 500 }
    );
  }
}
