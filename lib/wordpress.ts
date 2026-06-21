/**
 * WordPress GraphQL Types & Server-Side Fetch Utilities
 */

import {
  GET_ACTIVITIES_QUERY,
  GET_ACTIVITIES_QUERY_SAFE,
  GET_ACTIVITY_BY_SLUG_QUERY,
  GET_ACTIVITY_BY_SLUG_QUERY_SAFE,
  GET_PAGE_BY_SLUG_QUERY,
  GET_PROMOTION_BY_SLUG_QUERY,
  GET_PROMOTION_BY_SLUG_QUERY_SAFE,
  GET_PROMOTIONS_QUERY,
  GET_PROMOTIONS_QUERY_SAFE,
  GET_SITE_CONTACT_QUERY,
} from "./queries";
import type { PromotionType } from "./utils";
import { combineActivityDateTime, getPdfUrl } from "./utils";

const WORDPRESS_GRAPHQL_URL =
  process.env.NEXT_PUBLIC_WORDPRESS_URL || "http://vege-taiwan.local/graphql";

/** 設 USE_MOCK_DATA=true 時完全跳過 WordPress，僅用 Mock 資料（開發診斷用） */
export function isMockDataMode(): boolean {
  return process.env.USE_MOCK_DATA === "true";
}

let mockModeLogged = false;
function logMockModeOnce() {
  if (process.env.NODE_ENV === "development" && !mockModeLogged) {
    mockModeLogged = true;
    console.info("[Vegetaiwan] USE_MOCK_DATA=true — 跳過 WordPress，使用 Mock 資料");
  }
}

// ---- Types ----

export interface FeaturedImage {
  node: {
    sourceUrl: string;
    altText: string;
  };
}

/** Raw ACF fields as returned by WordPress GraphQL */
export interface ActivityFieldsRaw {
  activityDate?: string | null;
  activityTime?: string | null;
  activityLocation?: string | null;
  activityStatus?: string | string[] | null;
  registrationUrl?: string | null;
  eventEndDate?: string | null;
  eventDate?: string | null;
  location?: string | null;
}

/** Normalized for frontend components */
export interface ActivityFields {
  eventDate?: string | null;
  eventEndDate?: string | null;
  location?: string | null;
  registrationUrl?: string | null;
  activityStatus?: string | string[] | null;
}

export interface Activity {
  id: string;
  slug: string;
  title: string;
  date: string;
  excerpt?: string;
  content?: string;
  featuredImage?: FeaturedImage | null;
  activityFields?: ActivityFields | null;
}

export interface PromotionFieldsRaw {
  promotionType?: PromotionType | string | string[] | null;
  videoUrl?: string | null;
  promotionDate?: string | null;
  pdfFile?: {
    node?: {
      sourceUrl?: string;
      mediaItemUrl?: string;
    } | null;
  } | null;
}

export interface PromotionFields {
  promotionType?: PromotionType | null;
  videoUrl?: string | null;
  promotionDate?: string | null;
  pdfFile?: PromotionFieldsRaw["pdfFile"];
}

export interface Promotion {
  id: string;
  slug: string;
  title: string;
  date: string;
  excerpt?: string;
  content?: string;
  featuredImage?: FeaturedImage | null;
  promotionFields?: PromotionFields | null;
}

export interface WpPage {
  id: string;
  slug: string;
  title: string;
  content?: string;
  date?: string;
}

export interface SiteContact {
  contactAddress?: string | null;
  contactPhone?: string | null;
  contactEmail?: string | null;
}

type ActivityNode = Omit<Activity, "activityFields"> & {
  activityFields?: ActivityFieldsRaw | null;
};

type PromotionNode = Omit<Promotion, "promotionFields"> & {
  promotionFields?: PromotionFieldsRaw | null;
};

// ---- Normalizers ----

export function normalizeActivityFields(
  raw?: ActivityFieldsRaw | null,
  fallbackDate?: string
): ActivityFields {
  const mergedDate =
    combineActivityDateTime(raw?.activityDate, raw?.activityTime) ??
    raw?.eventDate ??
    fallbackDate ??
    null;

  return {
    eventDate: mergedDate,
    eventEndDate: raw?.eventEndDate ?? null,
    location: raw?.activityLocation ?? raw?.location ?? null,
    registrationUrl: raw?.registrationUrl ?? null,
    activityStatus: raw?.activityStatus ?? null,
  };
}

export function normalizeActivity(node: ActivityNode): Activity {
  return {
    ...node,
    activityFields: normalizeActivityFields(node.activityFields, node.date),
  };
}

export function normalizePromotionType(
  promotion: { promotionFields?: PromotionFieldsRaw | PromotionFields | null }
): PromotionType {
  const type = promotion.promotionFields?.promotionType;
  const value = Array.isArray(type) ? type[0] : type;
  if (value === "video" || value === "article" || value === "pdf") return value;
  return "article";
}

function normalizePromotion(node: PromotionNode): Promotion {
  const promotionType = normalizePromotionType({ promotionFields: node.promotionFields });
  return {
    ...node,
    promotionFields: {
      promotionType,
      videoUrl: node.promotionFields?.videoUrl ?? null,
      promotionDate: node.promotionFields?.promotionDate ?? null,
      pdfFile: node.promotionFields?.pdfFile ?? null,
    },
  };
}

export function getPromotionPdfUrl(promotion: Promotion): string | null {
  return getPdfUrl(promotion.promotionFields?.pdfFile);
}

// ---- GraphQL Fetch ----

export async function fetchGraphQL<T>(
  query: string,
  variables: Record<string, unknown> = {},
  revalidate = 60
): Promise<T> {
  const res = await fetch(WORDPRESS_GRAPHQL_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
    next: { revalidate },
  });

  if (!res.ok) {
    throw new Error(`GraphQL fetch failed: ${res.status} ${res.statusText}`);
  }

  const json = await res.json();

  if (json.errors?.length) {
    throw new Error(json.errors[0]?.message || "GraphQL Error");
  }

  return json.data as T;
}

async function fetchGraphQLWithFallback<T>(
  primaryQuery: string,
  fallbackQuery: string,
  variables: Record<string, unknown>
): Promise<T> {
  try {
    return await fetchGraphQL<T>(primaryQuery, variables);
  } catch (primaryError) {
    try {
      return await fetchGraphQL<T>(fallbackQuery, variables);
    } catch {
      throw primaryError;
    }
  }
}

async function fetchWithMockFallback<T>(
  fetcher: () => Promise<T>,
  fallback: T
): Promise<T> {
  try {
    const result = await fetcher();
    return result;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[WordPress] Fetch failed, using fallback data:", error);
    }
    return fallback;
  }
}

// ---- Data Accessors ----

export async function getActivities(): Promise<Activity[]> {
  if (isMockDataMode()) {
    logMockModeOnce();
    return MOCK_ACTIVITIES;
  }
  return fetchWithMockFallback(async () => {
    const data = await fetchGraphQLWithFallback<
      { activities: { nodes: ActivityNode[] } }
    >(GET_ACTIVITIES_QUERY_SAFE, GET_ACTIVITIES_QUERY, { first: 50 });
    return (data.activities?.nodes ?? []).map(normalizeActivity);
  }, MOCK_ACTIVITIES);
}

function decodeRouteSlug(slug: string): string {
  try {
    return decodeURIComponent(slug);
  } catch {
    return slug;
  }
}

export async function getActivityBySlug(slug: string): Promise<Activity | null> {
  const decodedSlug = decodeRouteSlug(slug);
  if (isMockDataMode()) {
    logMockModeOnce();
    return MOCK_ACTIVITIES.find((a) => a.slug === decodedSlug) ?? null;
  }
  return fetchWithMockFallback(async () => {
    const data = await fetchGraphQLWithFallback<
      { activity: ActivityNode | null }
    >(GET_ACTIVITY_BY_SLUG_QUERY_SAFE, GET_ACTIVITY_BY_SLUG_QUERY, {
      slug: decodedSlug,
    });
    return data.activity ? normalizeActivity(data.activity) : null;
  }, MOCK_ACTIVITIES.find((a) => a.slug === decodedSlug) ?? null);
}

export async function getPromotions(): Promise<Promotion[]> {
  if (isMockDataMode()) {
    logMockModeOnce();
    return MOCK_PROMOTIONS;
  }
  return fetchWithMockFallback(async () => {
    const data = await fetchGraphQLWithFallback<
      { promotions: { nodes: PromotionNode[] } }
    >(GET_PROMOTIONS_QUERY_SAFE, GET_PROMOTIONS_QUERY, { first: 50 });
    return (data.promotions?.nodes ?? []).map(normalizePromotion);
  }, MOCK_PROMOTIONS);
}

export async function getPromotionBySlug(slug: string): Promise<Promotion | null> {
  const decodedSlug = decodeRouteSlug(slug);
  if (isMockDataMode()) {
    logMockModeOnce();
    return MOCK_PROMOTIONS.find((p) => p.slug === decodedSlug) ?? null;
  }
  return fetchWithMockFallback(async () => {
    const data = await fetchGraphQLWithFallback<
      { promotion: PromotionNode | null }
    >(GET_PROMOTION_BY_SLUG_QUERY_SAFE, GET_PROMOTION_BY_SLUG_QUERY, {
      slug: decodedSlug,
    });
    return data.promotion ? normalizePromotion(data.promotion) : null;
  }, MOCK_PROMOTIONS.find((p) => p.slug === decodedSlug) ?? null);
}

export async function getLatestActivities(count = 2): Promise<Activity[]> {
  const all = await getActivities();
  return all.slice(0, count);
}

export async function getLatestPromotions(count = 2): Promise<Promotion[]> {
  const all = await getPromotions();
  return all.slice(0, count);
}

export async function getPageBySlug(slug: string): Promise<WpPage | null> {
  if (isMockDataMode()) {
    logMockModeOnce();
    return MOCK_PAGES[slug] ?? null;
  }
  return fetchWithMockFallback(async () => {
    const data = await fetchGraphQL<{ page: WpPage | null }>(
      GET_PAGE_BY_SLUG_QUERY,
      { uri: `/${slug}/` }
    );
    return data.page;
  }, MOCK_PAGES[slug] ?? null);
}

export async function getSiteContact(): Promise<SiteContact> {
  if (isMockDataMode()) {
    logMockModeOnce();
    return MOCK_SITE_CONTACT;
  }
  try {
    const data = await fetchGraphQL<{ siteContactFields: SiteContact | null }>(
      GET_SITE_CONTACT_QUERY
    );
    return data.siteContactFields ?? MOCK_SITE_CONTACT;
  } catch {
    return MOCK_SITE_CONTACT;
  }
}

// ---- Mock Data ----

export const MOCK_SITE_CONTACT: SiteContact = {
  contactAddress: "台北市中正區蔬食路 108 號 5 樓",
  contactPhone: "02-1234-5678",
  contactEmail: "contact@vegetaiwan.org",
};

export const MOCK_PAGES: Record<string, WpPage> = {
  about: {
    id: "mock-about",
    slug: "about",
    title: "關於社團",
    content:
      "<p>蔬食台灣促進會致力於推廣全民蔬食，建立和平及綠色環保的社會。我們相信，蔬食不僅是飲食模式的改變，更是對地球與生命尊重的體現。</p><p>透過活動、文宣與社區連結，我們持續喚起社會對環境保護與動物福祉的關注。</p>",
  },
  contact: {
    id: "mock-contact",
    slug: "contact",
    title: "聯絡我們",
    content: "<p>有任何建議或合作機會？歡迎與我們聯繫，我們將盡快回覆您的訊息。</p>",
  },
};

export const MOCK_ACTIVITIES: Activity[] = [
  {
    id: "1",
    slug: "2024-vegetarian-festival",
    title: "2024 全民蔬食嘉年華",
    date: "2026-04-22T10:00:00",
    excerpt:
      "每年地球日，我們舉辦全民蔬食嘉年華，推廣永續飲食文化，讓大家在歡樂的氛圍中認識蔬食的美好。",
    content:
      "<p>蔬食台灣促進會誠摯邀請您參與年度最大蔬食盛會！現場有豐富的蔬食市集、烹飪示範、環保講座與親子互動區。</p>",
    activityFields: {
      eventDate: "2026-04-22T10:00:00",
      eventEndDate: "2026-04-22T18:00:00",
      location: "臺北市大安森林公園",
      registrationUrl: "https://example.com/register/festival",
    },
  },
  {
    id: "2",
    slug: "vegan-cooking-workshop",
    title: "蔬食烹飪工作坊 — 春季特集",
    date: "2026-03-15T14:00:00",
    excerpt:
      "邀請知名蔬食主廚親自示範，學習如何以當季食材烹調美味健康的蔬食料理。",
    content: "<p>本工作坊將由資深蔬食主廚帶領，從食材挑選、調味技巧到擺盤美學。</p>",
    activityFields: {
      eventDate: "2026-03-15T14:00:00",
      eventEndDate: "2026-03-15T17:00:00",
      location: "台北市信義區社區廚房",
      registrationUrl: "https://example.com/register/workshop",
    },
  },
  {
    id: "3",
    slug: "animal-rights-march",
    title: "愛護動物大遊行",
    date: "2026-05-10T09:00:00",
    excerpt:
      "與動物保育團體聯合舉辦，提升社會大眾對動物權益的關注，共同為建立更友善的社會而努力。",
    content: "<p>我們將走上街頭，以和平方式倡議動物權益。</p>",
    activityFields: {
      eventDate: "2026-05-10T09:00:00",
      eventEndDate: "2026-05-10T12:00:00",
      location: "台北市中正紀念堂廣場",
      registrationUrl: "https://example.com/register/march",
    },
  },
  {
    id: "4",
    slug: "eco-campus-tour",
    title: "綠色校園蔬食巡迴講座",
    date: "2025-12-01T10:00:00",
    excerpt: "深入各大專院校，與年輕世代分享蔬食對地球環境的正面影響。",
    content: "<p>已圓滿結束的校園巡迴講座，感謝各校師生熱情參與。</p>",
    activityFields: {
      eventDate: "2025-12-01T10:00:00",
      eventEndDate: "2025-12-01T16:00:00",
      location: "全台各大學校園",
      registrationUrl: "https://example.com/register/campus",
    },
  },
];

export const MOCK_PROMOTIONS: Promotion[] = [
  {
    id: "p1",
    slug: "why-go-vegan",
    title: "為什麼選擇蔬食？十個改變你一生的理由",
    date: "2024-03-01",
    excerpt:
      "蔬食不僅對健康有益，更是愛護地球、善待動物最直接的行動。了解蔬食如何在各層面帶來正面改變。",
    content: "<p>從健康、環境到動物福祉，蔬食能在各層面帶來正面改變。</p>",
    promotionFields: { promotionType: "article", videoUrl: null, pdfFile: null },
  },
  {
    id: "p2",
    slug: "taiwan-vegan-map",
    title: "台灣蔬食地圖 — 全台最完整蔬食餐廳指南",
    date: "2024-02-15",
    excerpt: "從台北到屏東，精選超過 500 家純素食與蔬食友善餐廳。",
    content: "<p>完整蔬食餐廳指南，讓您在外也能輕鬆吃到美味又健康的蔬食。</p>",
    promotionFields: { promotionType: "article", videoUrl: null, pdfFile: null },
  },
  {
    id: "p3",
    slug: "vegan-nutrition-guide",
    title: "蔬食營養完全指南 — 吃對了更健康",
    date: "2024-01-20",
    excerpt: "破解蔬食飲食常見迷思，專業營養師帶你了解完整均衡的營養。",
    content: "<p>專業營養師解答蔬食常見問題。</p>",
    promotionFields: { promotionType: "article", videoUrl: null, pdfFile: null },
  },
  {
    id: "p4",
    slug: "documentary-earthlings",
    title: "影片推薦：《地球公民》— 重新認識我們與動物的關係",
    date: "2024-03-10",
    excerpt: "這部震撼人心的紀錄片，讓我們看見現代畜牧業的真實樣貌。",
    content: "<p>《地球公民》是探討人類與動物關係的重要紀錄片。</p>",
    promotionFields: {
      promotionType: "video",
      videoUrl: "https://www.youtube.com/watch?v=8gqwpfTrMIU",
      pdfFile: null,
    },
  },
  {
    id: "p5",
    slug: "vegan-brochure-2024",
    title: "2024 蔬食推廣手冊（PDF）",
    date: "2024-04-01",
    excerpt: "可下載的蔬食推廣手冊，適合社團分享與教育使用。",
    content: "<p>完整收錄蔬食環保數據與推廣素材。</p>",
    promotionFields: {
      promotionType: "pdf",
      videoUrl: null,
      pdfFile: {
        node: {
          sourceUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
          mediaItemUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        },
      },
    },
  },
];
