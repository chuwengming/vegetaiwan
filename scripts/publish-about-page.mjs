/**
 * Upload / update WordPress "about" page with tabbed section content.
 *
 * Usage:
 *   npm run wp:about
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { buildAboutPageHtml } from "../lib/about-content.ts";
import { createWpClient } from "./wp-client.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const ORG_IMAGE = path.resolve(ROOT, "docs/組織結構.jpg");

async function main() {
  const { WP_URL, wpFetch, upsertPage } = createWpClient(ROOT);

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

  const result = await upsertPage({
    slug: "about",
    title: "關於社團",
    content: buildAboutPageHtml(orgImageUrl),
  });

  console.log("已同步 about 頁面至 Local WordPress, ID:", result.id);
  console.log("後台:", `${WP_URL}/wp-admin/post.php?post=${result.id}&action=edit`);
}

main().catch((err) => {
  console.error("同步失敗:", err.message);
  if (err.body) console.error(JSON.stringify(err.body, null, 2));
  process.exit(1);
});
