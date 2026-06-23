/**
 * Upload / update WordPress "contact" page (intro content only).
 *
 * Usage:
 *   npm run wp:contact
 */

import path from "path";
import { fileURLToPath } from "url";
import { getContactPagePayload } from "../lib/contact-content.ts";
import { createWpClient } from "./wp-client.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

async function main() {
  const { WP_URL, upsertPage } = createWpClient(ROOT);
  const { title, slug, content } = getContactPagePayload();

  const result = await upsertPage({ slug, title, content });
  console.log(`已同步 contact 頁面至 Local WordPress, ID: ${result.id}`);
  console.log("後台:", `${WP_URL}/wp-admin/post.php?post=${result.id}&action=edit`);
}

main().catch((err) => {
  console.error("同步失敗:", err.message);
  if (err.body) console.error(JSON.stringify(err.body, null, 2));
  process.exit(1);
});
