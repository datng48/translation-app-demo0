import { NextResponse } from "next/server";
import axios from "axios";
import { prisma } from "@/lib/prisma";

interface ApiError {
  response?: {
    data?: Record<string, unknown>;
  };
  message?: string;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const word = searchParams.get("word");
  const language = searchParams.get("language");

  if (!word || !language) {
    return NextResponse.json(
      { error: "Word and language are required" },
      { status: 400 }
    );
  }

  try {
    const existingEntry = await prisma.dictionaryEntry.findFirst({
      where: {
        word,
        language,
      },
    });

    if (existingEntry) {
      return NextResponse.json(existingEntry);
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
              content: `You are a dictionary API. Provide a dictionary definition for the word "${word}" in ${language}. Return a JSON object with the following structure: { "definition": "the definition of the term, concise and short, straight to the point", "partOfSpeech": "the part of speech (noun, verb, etc.)", "examples": "example sentences using the word" }`,
            },
          ],
          temperature: 0.3,
          response_format: { type: "json_object" },
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${openAIKey}`,
          },
        }
      );

      let result;
      try {
        const content = response.data.choices[0].message.content.trim();
        result = JSON.parse(content);
      } catch (parseError) {
        console.error("JSON parsing error:", parseError);
        return NextResponse.json(
          { error: "Failed to parse dictionary response" },
          { status: 500 }
        );
      }

      let examples = "";
      if (result.examples) {
        if (Array.isArray(result.examples)) {
          examples = result.examples.join(". ");
        } else {
          examples = String(result.examples);
        }
      }

      const entry = await prisma.dictionaryEntry.create({
        data: {
          word,
          language,
          definition: result.definition || "",
          partOfSpeech: result.partOfSpeech || "",
          examples: examples,
        },
      });

      return NextResponse.json(entry);
    } catch (apiError: unknown) {
      const error = apiError as ApiError;
      console.error("OpenAI API error:", error.response?.data || error.message);
      return NextResponse.json(
        { error: "Dictionary service unavailable" },
        { status: 503 }
      );
    }
  } catch (error) {
    console.error("Dictionary lookup error:", error);
    return NextResponse.json(
      { error: "Failed to lookup word" },
      { status: 500 }
    );
  }
}
