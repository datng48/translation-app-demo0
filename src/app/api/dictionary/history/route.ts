import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const recentLookups = await prisma.dictionaryEntry.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
    });

    return NextResponse.json(recentLookups);
  } catch (error) {
    console.error("Failed to fetch dictionary history:", error);
    return NextResponse.json(
      { error: "Failed to fetch dictionary history" },
      { status: 500 }
    );
  }
}
