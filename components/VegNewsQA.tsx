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

export default function VegNewsQA() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<QueryResponse | null>(null);

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
    <section className="vegnews-qa mt-16 pt-16 border-t border-[var(--primary)]/10">
      <header className="mb-8 text-center">
        <p className="text-sm tracking-[0.3em] uppercase text-[var(--accent)] font-semibold mb-2">
          Knowledge Base
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-[var(--primary)] mb-3">
          蔬食資訊 Q&A
        </h2>
        <p className="text-[var(--secondary)]/70 max-w-2xl mx-auto">
          依社團知識庫內容回答蔬食倡議、環保、活動等相關問題，並附參考來源。
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
            placeholder="例如：什麼是全民蔬食運動？21天維根體驗營是什麼？"
            rows={3}
            maxLength={500}
            className="vegnews-qa-input"
            disabled={loading}
          />
          <div className="flex items-center justify-between gap-4 mt-4">
            <span className="text-sm text-[var(--secondary)]/50">
              {query.length}/500
            </span>
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="vegnews-qa-submit"
            >
              {loading ? "查詢知識庫中…" : "送出查詢"}
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
                  className="prose prose-lg max-w-none text-[var(--secondary)] vegnews-qa-answer"
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
          回答依知識庫內容由 AI 生成，僅供參考。如有疑問歡迎透過上方表單與我們聯繫。
        </p>
      </div>
    </section>
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
