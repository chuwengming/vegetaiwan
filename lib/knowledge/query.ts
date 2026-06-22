import fs from "fs";
import path from "path";
import {
  appendQueryLog,
  discoverKnowledgeBases,
  resolveWikiPagePath,
  type KnowledgeBase,
} from "./discover";
import {
  generateAnswer,
  scoreKnowledgeBases,
  selectRelevantPages,
  type RouteScore,
} from "./gemini";

export interface RetrievedPage {
  kb: string;
  page: string;
  relativePath: string;
  content: string;
}

export interface QuerySuccess {
  success: true;
  answer: string;
  sources: Array<{ kb: string; page: string }>;
  matchedKbs: RouteScore[];
}

export interface QueryFailure {
  success: false;
  message: string;
  matchedKbs?: RouteScore[];
  needsConfirmation?: boolean;
}

export type QueryResult = QuerySuccess | QueryFailure;

const SCORE_MATCH = 60;
const SCORE_REJECT = 40;

export async function queryKnowledgeBase(query: string): Promise<QueryResult> {
  const trimmed = query.trim();
  if (!trimmed) {
    return { success: false, message: "請輸入問題" };
  }

  const bases = discoverKnowledgeBases();
  if (bases.length === 0) {
    return {
      success: false,
      message: "找不到任何知識庫。請確認 knowledges/ 目錄已建立。",
    };
  }

  const scores = await scoreKnowledgeBases(trimmed, bases);
  const scoreMap = new Map(scores.map((s) => [s.kb, s]));

  const allScores: RouteScore[] = bases.map((kb) => ({
    kb: kb.name,
    score: scoreMap.get(kb.name)?.score ?? 0,
    reason: scoreMap.get(kb.name)?.reason ?? "未評分",
  }));

  const matchedBases = bases.filter(
    (kb) => (scoreMap.get(kb.name)?.score ?? 0) >= SCORE_MATCH
  );

  const maxScore = Math.max(...allScores.map((s) => s.score), 0);

  if (matchedBases.length === 0) {
    if (maxScore >= SCORE_REJECT && maxScore < SCORE_MATCH) {
      return {
        success: false,
        message:
          "您的提問可能與知識庫略有相關，但相關度不足。請嘗試更具體的蔬食或社團相關問題。",
        matchedKbs: allScores,
        needsConfirmation: true,
      };
    }

    return {
      success: false,
      message: "抱歉，您提問的內容不屬於目前任何已知的知識庫範疇。",
      matchedKbs: allScores,
    };
  }

  const retrieved: RetrievedPage[] = [];

  for (const knowledgeBase of matchedBases) {
    const pagePaths = await selectRelevantPages(
      trimmed,
      knowledgeBase.name,
      knowledgeBase.indexContent
    );

    for (const relativePath of pagePaths) {
      const absPath = resolveWikiPagePath(knowledgeBase.rootPath, relativePath);
      if (!absPath) continue;

      const content = fs.readFileSync(absPath, "utf8");
      const pageName = path.basename(absPath, ".md");

      retrieved.push({
        kb: knowledgeBase.name,
        page: pageName,
        relativePath: path
          .relative(knowledgeBase.rootPath, absPath)
          .replace(/\\/g, "/"),
        content,
      });
    }

    appendQueryLog(knowledgeBase.rootPath, trimmed);
  }

  const answer = await generateAnswer(
    trimmed,
    retrieved.map((r) => ({ kb: r.kb, page: r.page, content: r.content }))
  );

  const matchedKbs: RouteScore[] = matchedBases.map((kb) => ({
    kb: kb.name,
    score: scoreMap.get(kb.name)?.score ?? 100,
    reason: scoreMap.get(kb.name)?.reason ?? "",
  }));

  return {
    success: true,
    answer,
    sources: retrieved.map((r) => ({ kb: r.kb, page: r.page })),
    matchedKbs,
  };
}
