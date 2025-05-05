import axios from "axios";
import { NextResponse } from "next/server";

interface TranslationRequestParams {
  text: string;
  prompt?: string;
  model?: string;
  temperature?: number;
}

export class RequestService {
  private static readonly OPENAI_API_URL =
    "https://api.openai.com/v1/chat/completions";

  static async translateWithOpenAI({
    text,
    prompt,
    model = "gpt-4o-mini",
    temperature = 0.3,
  }: TranslationRequestParams) {
    const openAIKey = process.env.OPENAI_API_KEY;

    if (!openAIKey) {
      throw new Error("OpenAI API key is not configured");
    }

    if (!text) {
      return NextResponse.json(
        { error: "Missing required field!" },
        { status: 400 }
      );
    }

    try {
      const response = await axios.post(
        this.OPENAI_API_URL,
        {
          model,
          messages: [
            {
              role: "system",
              content: prompt,
            },
            {
              role: "user",
              content: text,
            },
          ],
          temperature,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${openAIKey}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error calling OpenAI API:", error);
      throw error;
    }
  }

  static async detectLanguageWithOpenAI({
    text,
    model = "gpt-4o-mini",
    temperature = 0.3,
  }: TranslationRequestParams) {
    const openAIKey = process.env.OPENAI_API_KEY;
    if (!openAIKey) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    try {
      const response = await axios.post(
        this.OPENAI_API_URL,
        {
          model,
          messages: [
            {
              role: "system",
              content: `You are a language detection system. You will be given a text, and you must detect what language it is written in. Respond with just the ISO language code (e.g., 'en' for English, 'es' for Spanish, 'fr' for French, 'vi' for Vietnamese). Only provide the language code, nothing else, here is the text: ${text} , please provide the language code as mentioned `,
            },
            {
              role: "user",
              content: text,
            },
          ],
          temperature,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${openAIKey}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error calling OpenAI API:", error);
      throw error;
    }
  }
}
