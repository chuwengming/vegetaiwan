# About / Contact 頁面同步 SOP

前端 About、Contact 為 headless 架構：**版面與互動在前端**，WordPress 僅存放可編輯的頁面內文（及 About 分頁 HTML）。

## 資料對應

| 頁面 | 前端來源 | WordPress slug | 同步腳本 |
|------|----------|----------------|----------|
| About | `lib/about-content.ts` + `app/about/page.tsx` | `about` | `npm run wp:about` |
| Contact | `lib/contact-content.ts`（intro）+ `app/contact/page.tsx`（版面、電話、Email、Q&A） | `contact` | `npm run wp:contact` |

Contact 頁電話、Email 為前端固定值，**不**寫入 WordPress。

## 修改流程

### About 頁

1. 編輯 `lib/about-content.ts`（分頁內文）或 `app/about/page.tsx`（外框）。
2. 執行 `npm run wp:about` → 更新 **Local** WordPress `about` 頁面。
3. 自行將 Local 變更複製／匯出至 Oracle 雲端 WordPress。

### Contact 頁

1. 編輯 `lib/contact-content.ts`（頂部 intro 內文）。
2. 若改版面、電話、Email、Q&A，編輯 `app/contact/page.tsx` / `components/VegNewsQA.tsx`。
3. 執行 `npm run wp:contact` → 更新 **Local** WordPress `contact` 頁面。
4. 自行將 Local 變更複製／匯出至 Oracle 雲端 WordPress。

## 前置條件

- Local by Flywheel 站點 `vege-taiwan.local` 已啟動。
- `../WP-Importor/env.local` 已設定：
  - `WP_URL=http://vege-taiwan.local`
  - `WP_USERNAME`
  - `WP_APP_PASSWORD`（WordPress 應用程式密碼）

## 驗證

GraphQL 查詢（Local 或 Oracle）：

```json
{
  "query": "query { page(id: \"/contact/\", idType: URI) { title content } }"
}
```

前端約 60 秒 revalidate 後重新整理 `/contact` 確認 intro 一致。

## Oracle 手動同步

擇一即可：

- **手動**：Oracle 後台 → 頁面 → 聯絡我們 → 貼上與 Local 相同標題／內文。
- **匯出／匯入**：Local 工具 → 匯出頁面 → Oracle 工具 → 匯入。
- **整站遷移**：Duplicator / All-in-One WP Migration 等（匯入後確認 slug 仍為 `contact`）。
