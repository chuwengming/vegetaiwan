import type { Activity, Promotion } from "./wordpress";
import { normalizePromotionType } from "./wordpress";
import { parseYouTubeId } from "./utils";

const SIX_MONTHS_MS = 1000 * 60 * 60 * 24 * 30.4375 * 6;

export function getActivityEventDate(activity: Activity): string | null {
  return activity.activityFields?.eventDate ?? activity.date ?? null;
}

export function getPromotionDisplayDate(promotion: Promotion): string | null {
  return promotion.promotionFields?.promotionDate ?? promotion.date ?? null;
}

export function parseSortableDate(dateStr?: string | null): number {
  if (!dateStr) return 0;
  const time = new Date(dateStr).getTime();
  return Number.isNaN(time) ? 0 : time;
}

/** 活動／文宣日期距今未超過半年（無日期者保留） */
export function isWithinSixMonths(dateStr?: string | null, now = new Date()): boolean {
  if (!dateStr) return true;

  const time = new Date(dateStr).getTime();
  if (Number.isNaN(time)) return true;

  return now.getTime() - time <= SIX_MONTHS_MS;
}

export function sortActivitiesByEventDate(activities: Activity[]): Activity[] {
  return [...activities].sort(
    (a, b) => parseSortableDate(getActivityEventDate(b)) - parseSortableDate(getActivityEventDate(a))
  );
}

export function sortPromotionsByDisplayDate(promotions: Promotion[]): Promotion[] {
  return [...promotions].sort(
    (a, b) =>
      parseSortableDate(getPromotionDisplayDate(b)) - parseSortableDate(getPromotionDisplayDate(a))
  );
}

export function filterActivitiesWithinSixMonths(activities: Activity[]): Activity[] {
  return activities.filter((activity) =>
    isWithinSixMonths(getActivityEventDate(activity))
  );
}

export function filterPromotionsWithinSixMonths(promotions: Promotion[]): Promotion[] {
  return promotions.filter((promotion) =>
    isWithinSixMonths(getPromotionDisplayDate(promotion))
  );
}

/** 首頁中間區塊：半年內、依日期新到舊，取前 N 筆 */
export function getHomeFeaturedActivities(activities: Activity[], limit = 2): Activity[] {
  return sortActivitiesByEventDate(filterActivitiesWithinSixMonths(activities)).slice(0, limit);
}

export function getHomeFeaturedPromotions(promotions: Promotion[], limit = 2): Promotion[] {
  return sortPromotionsByDisplayDate(filterPromotionsWithinSixMonths(promotions)).slice(0, limit);
}

/** 側欄清單：依日期新到舊，取前 N 筆（不足則全列） */
export function getSidebarActivityList(activities: Activity[], limit = 10): Activity[] {
  return sortActivitiesByEventDate(activities).slice(0, limit);
}

/** 具備可播放影音連結的 video 類型文宣 */
export function hasPlayableVideo(promotion: Promotion): boolean {
  return (
    normalizePromotionType(promotion) === "video" &&
    !!parseYouTubeId(promotion.promotionFields?.videoUrl)
  );
}

export function getSidebarVideoPromotions(promotions: Promotion[], limit = 10): Promotion[] {
  return sortPromotionsByDisplayDate(promotions.filter(hasPlayableVideo)).slice(0, limit);
}

export function getSidebarArticlePromotions(promotions: Promotion[], limit = 10): Promotion[] {
  return sortPromotionsByDisplayDate(
    promotions.filter((promotion) => !hasPlayableVideo(promotion))
  ).slice(0, limit);
}
