import {
  getDefaultAboutSections,
  type AboutSection,
  type AboutSectionId,
} from "./about-content";

const SECTION_LABELS: Record<AboutSectionId, string> = {
  intro: "社團介紹",
  philosophy: "社團的理念",
  organization: "社團組織",
  vision: "願景",
};

const SECTION_ORDER: AboutSectionId[] = [
  "intro",
  "philosophy",
  "organization",
  "vision",
];

/** 從 WordPress HTML 解析分頁區塊（支援 data-vege-about-section 與舊版 HTML 註解） */
export function parseAboutSectionsFromHtml(
  html?: string | null,
  fallbackOrgImageUrl = "/about/org-structure.jpg"
): AboutSection[] {
  const defaults = getDefaultAboutSections(fallbackOrgImageUrl);
  if (!html?.trim()) return defaults;

  const parsed = new Map<AboutSectionId, string>();

  const dataAttrRegex =
    /<section[^>]*data-vege-about-section="(intro|philosophy|organization|vision)"[^>]*>([\s\S]*?)<\/section>/gi;
  let match: RegExpExecArray | null;

  while ((match = dataAttrRegex.exec(html)) !== null) {
    parsed.set(match[1] as AboutSectionId, match[2].trim());
  }

  if (parsed.size === 0) {
    const commentRegex =
      /<!--\s*vege-about-section:(intro|philosophy|organization|vision)\s*-->([\s\S]*?)<!--\s*\/vege-about-section:\1\s*-->/gi;
    while ((match = commentRegex.exec(html)) !== null) {
      parsed.set(match[1] as AboutSectionId, match[2].trim());
    }
  }

  if (parsed.size === 0) {
    return defaults;
  }

  return SECTION_ORDER.map((id) => ({
    id,
    label: SECTION_LABELS[id],
    html: parsed.get(id) ?? defaults.find((s) => s.id === id)?.html ?? "",
  }));
}
