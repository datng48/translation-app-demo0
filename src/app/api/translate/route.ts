import { NextResponse } from "next/server";
import { RequestService } from "@/lib/services/request.service";

export async function POST(request: Request) {
  try {
    const { text, sourceLanguage, targetLanguage } = await request.json();

    if (!text || !sourceLanguage || !targetLanguage) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    try {
      const prompt =
        sourceLanguage === "auto"
          ? `You are a professional translator. Detect the language of the provided text and translate it to ${targetLanguage}. Only respond with the translated text, no commentary, make the response concise and correct as possible`
          : `You are a professional translator. Translate the following text from ${sourceLanguage} to ${targetLanguage}. Only respond with the translated text, no commentary, make the response concise and correct as possible`;

      const response = await RequestService.translateWithOpenAI({
        text,
        prompt,
      });

      const translatedText = response.choices[0].message.content.trim();

      return NextResponse.json({
        translatedText,
        id: Math.floor(Math.random() * 1000),
      });
    } catch {
      return NextResponse.json({ error: "Error" }, { status: 503 });
    }
  } catch {
    return NextResponse.json(
      { error: "Failed to translate text" },
      { status: 500 }
    );
  }
}
