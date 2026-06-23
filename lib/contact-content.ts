/** Contact 頁面 WordPress 內文（與前端 intro 同步） */
export const CONTACT_PAGE_TITLE = "聯絡我們";

export const CONTACT_PAGE_INTRO_HTML = `
<p>有任何建議或合作機會？歡迎透過電話或電子信箱與我們聯繫。</p>
`.trim();

export function getContactPagePayload() {
  return {
    title: CONTACT_PAGE_TITLE,
    slug: "contact" as const,
    content: CONTACT_PAGE_INTRO_HTML,
  };
}
