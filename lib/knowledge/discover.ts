import fs from "fs";
import path from "path";

export interface KnowledgeBase {
  name: string;
  rootPath: string;
  overview: string;
  indexContent: string;
}

/** 固定於專案 knowledges/ 目錄（部署時需納入 output tracing） */
const KB_ROOT = path.join(/* turbopackIgnore: true */ process.cwd(), "knowledges");

export function getKnowledgeRoot(): string {
  return KB_ROOT;
}

/** 掃描 knowledges/ 下所有有效知識庫 */
export function discoverKnowledgeBases(): KnowledgeBase[] {
  if (!fs.existsSync(KB_ROOT)) return [];

  const entries = fs.readdirSync(KB_ROOT, { withFileTypes: true });
  const bases: KnowledgeBase[] = [];

  for (const entry of entries) {
    if (!entry.isDirectory() || entry.name.startsWith(".")) continue;

    const rootPath = path.join(KB_ROOT, entry.name);
    const overviewPath = path.join(rootPath, "wiki", "overview.md");
    const indexPath = path.join(rootPath, "wiki", "index.md");

    if (!fs.existsSync(overviewPath) || !fs.existsSync(indexPath)) continue;

    bases.push({
      name: entry.name,
      rootPath,
      overview: fs.readFileSync(overviewPath, "utf8"),
      indexContent: readIndexFiles(rootPath),
    });
  }

  return bases;
}

function readIndexFiles(kbRoot: string): string {
  const wikiDir = path.join(kbRoot, "wiki");
  const parts: string[] = [];

  for (const file of ["index.md", "index-entities.md", "index-concepts.md", "index-sources.md"]) {
    const filePath = path.join(wikiDir, file);
    if (fs.existsSync(filePath)) {
      parts.push(`# ${file}\n${fs.readFileSync(filePath, "utf8")}`);
    }
  }

  return parts.join("\n\n");
}

export function resolveWikiPagePath(
  kbRoot: string,
  relativePath: string
): string | null {
  const normalized = relativePath.replace(/\\/g, "/").replace(/^\//, "");
  if (normalized.includes("..")) return null;

  const candidates = [
    path.join(kbRoot, normalized),
    path.join(kbRoot, "wiki", normalized.replace(/^wiki\//, "")),
  ];

  for (const candidate of candidates) {
    const resolved = path.resolve(candidate);
    const wikiRoot = path.resolve(kbRoot, "wiki");
    if (!resolved.startsWith(wikiRoot)) continue;
    if (fs.existsSync(resolved) && fs.statSync(resolved).isFile()) {
      return resolved;
    }
  }

  return null;
}

export function appendQueryLog(kbRoot: string, querySummary: string): void {
  try {
    const logPath = path.join(kbRoot, "wiki", "log.md");
    if (!fs.existsSync(logPath)) return;
    const dateStr = new Date().toISOString().split("T")[0];
    const summary = querySummary.length > 40 ? `${querySummary.slice(0, 40)}…` : querySummary;
    fs.appendFileSync(logPath, `\n## [${dateStr}] query | ${summary}\n`, "utf8");
  } catch {
    // 正式環境檔案系統可能唯讀，靜默略過
  }
}
