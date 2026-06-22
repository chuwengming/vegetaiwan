import { GoogleGenAI } from "@google/genai";
import type { KnowledgeBase } from "./discover";

const DEFAULT_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

let client: GoogleGenAI | null = null;

function getClient(): GoogleGenAI {
  if (!client) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY 未設定");
    }
    client = new GoogleGenAI({ apiKey });
  }
  return client;
}

export async function generateJson<T>(prompt: string): Promise<T> {
  const ai = getClient();
  const response = await ai.models.generateContent({
    model: DEFAULT_MODEL,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      temperature: 0.2,
    },
  });

  const text = response.text?.trim();
  if (!text) throw new Error("Gemini 回傳為空");

  return JSON.parse(text) as T;
}

export async function generateText(prompt: string): Promise<string> {
  const ai = getClient();
  const response = await ai.models.generateContent({
    model: DEFAULT_MODEL,
    contents: prompt,
    config: {
      temperature: 0.3,
    },
  });

  const text = response.text?.trim();
  if (!text) throw new Error("Gemini 回傳為空");
  return text;
}

export interface RouteScore {
  kb: string;
  score: number;
  reason: string;
}

export async function scoreKnowledgeBases(
  query: string,
  bases: KnowledgeBase[]
): Promise<RouteScore[]> {
  if (bases.length === 1) {
    return [
      {
        kb: bases[0].name,
        score: 100,
        reason: "專案目前僅有一個知識庫，直接納入查詢",
      },
    ];
  }

  const kbSummaries = bases
    .map((kb) => `### ${kb.name}\n${kb.overview.slice(0, 1500)}`)
    .join("\n\n");

  const result = await generateJson<{ scores: RouteScore[] }>(`
你是知識庫語意路由器。評估使用者提問與各知識庫的關聯度（0-100）。

使用者提問：${JSON.stringify(query)}

知識庫列表：
${kbSummaries}

請回傳 JSON：
{
  "scores": [
    { "kb": "知識庫名稱", "score": 0-100, "reason": "一句話理由" }
  ]
}

規則：
- score >= 60 表示高度相關
- score < 40 表示不相關
- 只回傳 JSON，不要其他文字
`);

  return result.scores ?? [];
}

export interface PageSelection {
  pages: string[];
}

export async function selectRelevantPages(
  query: string,
  kbName: string,
  indexContent: string
): Promise<string[]> {
  const result = await generateJson<PageSelection>(`
你是 wiki 檢索助手。根據使用者問題，從索引中挑選最相關的 2-3 個 Markdown 頁面。

使用者提問：${JSON.stringify(query)}
知識庫：${kbName}

索引內容：
${indexContent.slice(0, 8000)}

請回傳 JSON：
{
  "pages": ["wiki/concepts/範例.md", "wiki/entities/範例.md"]
}

規則：
- pages 陣列長度 2-3（若索引尚無頁面可回傳空陣列）
- 路徑相對於知識庫根目錄，以 wiki/ 開頭
- 只回傳 JSON
`);

  return (result.pages ?? []).slice(0, 3);
}

export async function generateAnswer(
  query: string,
  retrieved: Array<{ kb: string; page: string; content: string }>
): Promise<string> {
  if (retrieved.length === 0) {
    return "已檢索知識庫索引，但目前尚無相關 wiki 頁面內容。請先將文件放入 `knowledges/vegenews/raw/` 並執行 ingest 導入。";
  }

  const context = retrieved
    .map(
      (item) =>
        `--- 知識庫: ${item.kb} | 頁面: ${item.page} ---\n${item.content.slice(0, 6000)}`
    )
    .join("\n\n");

  return generateText(`
你是蔬食台灣促進會的知識庫問答助手。請**僅根據**以下 wiki 內容回答，不要憑空捏造。

使用者提問：${JSON.stringify(query)}

Wiki 內容：
${context}

回答規則：
1. 使用繁體中文，語氣端莊、清晰
2. 關鍵事實後方加上證據鏈：(來源: [[頁面名稱]] | 知識庫: KB名稱)
3. 頁面名稱取檔名不含 .md，例如 wiki/concepts/全民蔬食.md → [[全民蔬食]]
4. 若內容不足以回答，誠實說明「已檢索相關頁面，但並無提及…」
5. 若不同頁面有矛盾，同時陳述並標註各自來源
6. 使用 Markdown 格式（標題、列表可適度使用）
`);
}
