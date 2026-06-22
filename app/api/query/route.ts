import { NextResponse } from "next/server";
import { getClientIp, checkRateLimit } from "@/lib/knowledge/rate-limit";
import { queryKnowledgeBase } from "@/lib/knowledge/query";

export const runtime = "nodejs";

const MAX_QUERY_LENGTH = 500;

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { success: false, message: "查詢過於頻繁，請稍後再試。" },
        { status: 429 }
      );
    }

    const body = await request.json();
    const query = typeof body?.query === "string" ? body.query.trim() : "";

    if (!query) {
      return NextResponse.json(
        { success: false, message: "請輸入問題" },
        { status: 400 }
      );
    }

    if (query.length > MAX_QUERY_LENGTH) {
      return NextResponse.json(
        { success: false, message: `問題長度不可超過 ${MAX_QUERY_LENGTH} 字` },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { success: false, message: "伺服器未設定 GEMINI_API_KEY" },
        { status: 503 }
      );
    }

    const result = await queryKnowledgeBase(query);
    const status = result.success ? 200 : 200;

    return NextResponse.json(result, { status });
  } catch (error) {
    console.error("[api/query]", error);
    return NextResponse.json(
      {
        success: false,
        message: "查詢時發生錯誤，請稍後再試。",
      },
      { status: 500 }
    );
  }
}
