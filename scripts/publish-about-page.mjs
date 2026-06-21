/**
 * Upload / update WordPress "about" page with tabbed section content.
 *
 * Usage:
 *   node --experimental-strip-types scripts/publish-about-page.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { buildAboutPageHtml } from "../lib/about-content.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const ORG_IMAGE = path.resolve(ROOT, "docs/組織結構.jpg");

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  for (const line of fs.readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
}

[
  path.resolve(ROOT, "../WP-Importor/env.local"),
].forEach(loadEnvFile);

const WP_URL = (process.env.WP_URL || "http://vege-taiwan.local").replace(/\/$/, "");
const WP_USERNAME = process.env.WP_USERNAME;
const WP_APP_PASSWORD = process.env.WP_APP_PASSWORD;

if (!WP_USERNAME || !WP_APP_PASSWORD) {
  console.error("缺少 WP_USERNAME / WP_APP_PASSWORD，請設定 WP-Importor/env.local");
  process.exit(1);
}

const auth = Buffer.from(`${WP_USERNAME}:${WP_APP_PASSWORD}`).toString("base64");

async function wpFetch(apiPath, options = {}) {
  const res = await fetch(`${WP_URL}/wp-json${apiPath}`, {
    ...options,
    headers: {
      Authorization: `Basic ${auth}`,
      ...(options.headers || {}),
    },
  });
  const text = await res.text();
  let body;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }
  if (!res.ok) {
    const err = new Error(body?.message || `HTTP ${res.status}`);
    err.status = res.status;
    err.body = body;
    throw err;
  }
  return body;
}

async function main() {
  let orgImageUrl = "/about/org-structure.jpg";

  if (fs.existsSync(ORG_IMAGE)) {
    const buffer = fs.readFileSync(ORG_IMAGE);
    const form = new FormData();
    form.append("file", new Blob([buffer]), "org-structure.jpg");
    form.append("title", "臺中市蔬食台灣促進會組織圖");
    form.append("alt_text", "臺中市蔬食台灣促進會組織圖");
    const media = await wpFetch("/wp/v2/media", { method: "POST", body: form });
    orgImageUrl = media.source_url;
    console.log("已上傳組織圖:", orgImageUrl);
  }

  const content = buildAboutPageHtml(orgImageUrl);
  const payload = {
    title: "關於社團",
    slug: "about",
    status: "publish",
    content,
  };

  const existing = await wpFetch("/wp/v2/pages?slug=about&per_page=1");
  let result;

  if (existing?.length) {
    result = await wpFetch(`/wp/v2/pages/${existing[0].id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    console.log("已更新 about 頁面, ID:", result.id);
  } else {
    result = await wpFetch("/wp/v2/pages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    console.log("已建立 about 頁面, ID:", result.id);
  }

  console.log("後台:", `${WP_URL}/wp-admin/post.php?post=${result.id}&action=edit`);
}

main().catch((err) => {
  console.error("上傳失敗:", err.message);
  if (err.body) console.error(JSON.stringify(err.body, null, 2));
  process.exit(1);
});
