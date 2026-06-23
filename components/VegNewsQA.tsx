"use client";

import { useState } from "react";

interface QuerySource {
  kb: string;
  page: string;
}

interface QueryResponse {
  success: boolean;
  message?: string;
  answer?: string;
  sources?: QuerySource[];
}

interface VegNewsQAProps {
  layout?: "full" | "sidebar";
}

export default function VegNewsQA({ layout = "full" }: VegNewsQAProps) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<QueryResponse | null>(null);
  const isSidebar = layout === "sidebar";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed || loading) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: trimmed }),
      });

      const data: QueryResponse = await res.json();
      setResult(data);
    } catch {
      setResult({
        success: false,
        message: "無法連線至查詢服務，請稍後再試。",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      className={`vegnews-qa ${isSidebar ? "vegnews-qa--sidebar" : "vegnews-qa--full"}`}
    >
      <header className={isSidebar ? "vegnews-qa-header-sidebar" : "vegnews-qa-header-full"}>
        <p className="vegnews-qa-eyebrow">AI Knowledge Base</p>
        <h2 className="vegnews-qa-title">蔬食資訊 Q&A</h2>
        <p className="vegnews-qa-desc">
          依社團知識庫內容回答蔬食倡議、環保、活動等相關問題，並附參考來源。
        </p>
        <p className="vegnews-qa-patience" role="note">
          AI 回應速度稍慢，請耐心等候！
        </p>
      </header>

      <div className="vegnews-qa-card">
        <form onSubmit={handleSubmit} className="vegnews-qa-form">
          <label htmlFor="vegnews-query" className="sr-only">
            蔬食相關問題
          </label>
          <textarea
            id="vegnews-query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="例如：什麼是全民蔬食運動？世界素食日是哪一天？"
            rows={isSidebar ? 4 : 3}
            maxLength={500}
            className="vegnews-qa-input"
            disabled={loading}
          />
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4">
            <span className="text-sm text-[var(--secondary)]/50">
              {query.length}/500
            </span>
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="vegnews-qa-submit w-full sm:w-auto"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <LoadingSpinner />
                  查詢中…
                </span>
              ) : (
                "送出查詢"
              )}
            </button>
          </div>
        </form>

        {result && (
          <div
            className={`vegnews-qa-result ${result.success ? "is-success" : "is-error"}`}
            aria-live="polite"
          >
            {result.success && result.answer ? (
              <>
                <div
                  className="prose prose-sm md:prose-base max-w-none text-[var(--secondary)] vegnews-qa-answer"
                  dangerouslySetInnerHTML={{ __html: markdownToSimpleHtml(result.answer) }}
                />
                {result.sources && result.sources.length > 0 && (
                  <div className="vegnews-qa-sources">
                    <h3 className="text-sm font-bold text-[var(--primary)] mb-2">
                      參考來源
                    </h3>
                    <ul className="flex flex-wrap gap-2">
                      {result.sources.map((src) => (
                        <li
                          key={`${src.kb}-${src.page}`}
                          className="vegnews-qa-source-tag"
                        >
                          [[{src.page}]] · {src.kb}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            ) : (
              <p className="text-[var(--secondary)]/80">{result.message}</p>
            )}
          </div>
        )}

        <p className="vegnews-qa-disclaimer">
          回答依知識庫內容由 AI 生成，僅供參考。如有疑問歡迎來電或來信與我們聯繫。
        </p>
      </div>
    </section>
  );
}

function LoadingSpinner() {
  return (
    <svg
      className="animate-spin h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

/** 輕量 Markdown → HTML（標題、列表、粗體、段落） */
function markdownToSimpleHtml(md: string): string {
  const escaped = md
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  return escaped
    .split(/\n\n+/)
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return "";

      if (trimmed.startsWith("### ")) {
        return `<h4>${inlineFormat(trimmed.slice(4))}</h4>`;
      }
      if (trimmed.startsWith("## ")) {
        return `<h3>${inlineFormat(trimmed.slice(3))}</h3>`;
      }
      if (trimmed.startsWith("# ")) {
        return `<h2>${inlineFormat(trimmed.slice(2))}</h2>`;
      }
      if (/^[-*] /.test(trimmed) || /^\d+\. /.test(trimmed)) {
        const items = trimmed
          .split("\n")
          .map((line) => line.replace(/^[-*] |^\d+\. /, "").trim())
          .filter(Boolean)
          .map((item) => `<li>${inlineFormat(item)}</li>`)
          .join("");
        const tag = /^\d+\. /.test(trimmed) ? "ol" : "ul";
        return `<${tag}>${items}</${tag}>`;
      }

      return `<p>${inlineFormat(trimmed.replace(/\n/g, "<br />"))}</p>`;
    })
    .join("");
}

function inlineFormat(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\[\[(.+?)\]\]/g, "<code class='wiki-link'>[[$1]]</code>");
}
