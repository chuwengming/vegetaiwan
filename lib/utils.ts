export type ActivityStatus = "upcoming" | "ongoing" | "ended";

export type PromotionType = "video" | "article" | "pdf";

export function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}

export function formatDate(dateStr: string, withTime = false): string {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr;

  const options: Intl.DateTimeFormatOptions = withTime
    ? { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" }
    : { year: "numeric", month: "long", day: "numeric" };

  return date.toLocaleDateString("zh-TW", options);
}

export function getActivityStatus(
  eventDate?: string | null,
  eventEndDate?: string | null,
  now: Date = new Date()
): ActivityStatus {
  if (!eventDate) return "upcoming";

  const start = new Date(eventDate);
  const end = eventEndDate ? new Date(eventEndDate) : start;

  if (Number.isNaN(start.getTime())) return "upcoming";

  if (now < start) return "upcoming";
  if (now <= end) return "ongoing";
  return "ended";
}

export const ACTIVITY_STATUS_LABELS: Record<ActivityStatus, string> = {
  upcoming: "即將舉行",
  ongoing: "進行中",
  ended: "已結束",
};

export const ACTIVITY_STATUS_COLORS: Record<ActivityStatus, string> = {
  upcoming: "bg-blue-500",
  ongoing: "bg-green-500",
  ended: "bg-gray-400",
};

export const PROMOTION_TYPE_LABELS: Record<PromotionType, string> = {
  video: "影音",
  article: "文章",
  pdf: "PDF",
};

export const PROMOTION_TYPE_COLORS: Record<PromotionType, string> = {
  video: "bg-red-500",
  article: "bg-[var(--primary)]",
  pdf: "bg-amber-600",
};

export function parseYouTubeId(url?: string | null): string | null {
  if (!url) return null;
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/shorts\/([^&\n?#]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match?.[1]) return match[1];
  }
  return null;
}

export function getPdfUrl(pdfFile?: { node?: { sourceUrl?: string; mediaItemUrl?: string } | null } | null): string | null {
  return pdfFile?.node?.mediaItemUrl ?? pdfFile?.node?.sourceUrl ?? null;
}

/**
 * Merge WordPress ACF activityDate (d/m/Y) + activityTime (g:i a) into ISO datetime.
 */
export function combineActivityDateTime(
  dateStr?: string | null,
  timeStr?: string | null
): string | null {
  if (!dateStr?.trim()) return null;

  const trimmedDate = dateStr.trim();

  // Already ISO / RFC3339
  if (/^\d{4}-\d{2}-\d{2}/.test(trimmedDate)) {
    const iso = new Date(trimmedDate);
    if (!Number.isNaN(iso.getTime())) {
      if (timeStr?.trim()) {
        const t = parseTime12h(timeStr.trim());
        if (t) {
          iso.setHours(t.hours, t.minutes, 0, 0);
        }
      }
      return iso.toISOString();
    }
  }

  // d/m/Y or m/d/Y
  const parts = trimmedDate.split(/[/.-]/).map((p) => parseInt(p, 10));
  if (parts.length !== 3 || parts.some(Number.isNaN)) return trimmedDate;

  let day: number;
  let month: number;
  let year = parts[2];

  // d/m/Y when first segment > 12
  if (parts[0] > 12) {
    [day, month] = parts;
  } else if (parts[1] > 12) {
    // m/d/Y
    [month, day] = parts;
  } else {
    // Default WordPress return_format d/m/Y
    [day, month] = parts;
  }

  if (year < 100) year += 2000;

  let hours = 0;
  let minutes = 0;
  if (timeStr?.trim()) {
    const t = parseTime12h(timeStr.trim());
    if (t) {
      hours = t.hours;
      minutes = t.minutes;
    }
  }

  const combined = new Date(year, month - 1, day, hours, minutes);
  if (Number.isNaN(combined.getTime())) return null;
  return combined.toISOString();
}

function parseTime12h(timeStr: string): { hours: number; minutes: number } | null {
  const match = timeStr.match(/^(\d{1,2}):(\d{2})\s*(am|pm)$/i);
  if (!match) return null;

  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const meridiem = match[3].toLowerCase();

  if (meridiem === "pm" && hours < 12) hours += 12;
  if (meridiem === "am" && hours === 12) hours = 0;

  return { hours, minutes };
}

/** Map WordPress activityStatus ACF value to frontend status */
export function mapWpActivityStatus(
  wpStatus?: string | string[] | null
): ActivityStatus | null {
  const value = Array.isArray(wpStatus) ? wpStatus[0] : wpStatus;
  if (value === "upcoming") return "upcoming";
  if (value === "ongoing") return "ongoing";
  if (value === "finished") return "ended";
  return null;
}

export function resolveActivityStatus(
  eventDate?: string | null,
  eventEndDate?: string | null,
  wpStatus?: string | string[] | null,
  now: Date = new Date()
): ActivityStatus {
  const mapped = mapWpActivityStatus(wpStatus);
  if (mapped) return mapped;
  return getActivityStatus(eventDate, eventEndDate, now);
}
