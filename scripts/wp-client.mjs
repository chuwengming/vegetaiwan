/**
 * Shared WordPress REST client for Local CMS page sync.
 * Credentials: ../WP-Importor/env.local (WP_URL, WP_USERNAME, WP_APP_PASSWORD)
 */

import fs from "fs";
import path from "path";

export function loadWpEnv(rootDir) {
  for (const rel of ["../WP-Importor/env.local", ".env.local"]) {
    const filePath = path.resolve(rootDir, rel);
    if (!fs.existsSync(filePath)) continue;
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
}

export function createWpClient(rootDir) {
  loadWpEnv(rootDir);

  const WP_URL = (process.env.WP_URL || "http://vege-taiwan.local").replace(/\/$/, "");
  const WP_USERNAME = process.env.WP_USERNAME;
  const WP_APP_PASSWORD = process.env.WP_APP_PASSWORD;

  if (!WP_USERNAME || !WP_APP_PASSWORD) {
    throw new Error("缺少 WP_USERNAME / WP_APP_PASSWORD，請設定 WP-Importor/env.local");
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

  async function upsertPage({ slug, title, content, status = "publish" }) {
    const payload = { title, slug, status, content };
    const existing = await wpFetch(`/wp/v2/pages?slug=${encodeURIComponent(slug)}&per_page=1`);

    if (existing?.length) {
      return wpFetch(`/wp/v2/pages/${existing[0].id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    return wpFetch("/wp/v2/pages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  }

  return { WP_URL, wpFetch, upsertPage };
}
