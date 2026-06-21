import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getActivityBySlug } from "@/lib/wordpress";
import {
  formatDate,
  resolveActivityStatus,
  ACTIVITY_STATUS_LABELS,
  ACTIVITY_STATUS_COLORS,
} from "@/lib/utils";

export default async function ActivityDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const activity = await getActivityBySlug(slug);

  if (!activity) {
    notFound();
  }

  const status = resolveActivityStatus(
    activity.activityFields?.eventDate,
    activity.activityFields?.eventEndDate,
    activity.activityFields?.activityStatus
  );
  const isEnded = status === "ended";
  const registrationUrl = activity.activityFields?.registrationUrl;

  return (
    <article className="max-w-[900px] mx-auto px-4 py-16">
      <Link
        href="/activities"
        className="text-[var(--primary)] font-bold mb-8 inline-block hover:translate-x-[-4px] transition-transform"
      >
        ← 返回活動列表
      </Link>

      {activity.featuredImage?.node?.sourceUrl && (
        <div className="relative h-[280px] md:h-[480px] w-full rounded-3xl overflow-hidden mb-8 shadow-2xl">
          <Image
            src={activity.featuredImage.node.sourceUrl}
            alt={activity.featuredImage.node.altText || activity.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      <header className="mb-10">
        <span
          className={`inline-block px-3 py-1 rounded-full text-white text-sm font-bold mb-4 ${ACTIVITY_STATUS_COLORS[status]}`}
        >
          {ACTIVITY_STATUS_LABELS[status]}
        </span>
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[var(--secondary)]">
          {activity.title}
        </h1>

        <div className="flex flex-col gap-3 text-lg bg-white p-6 rounded-2xl shadow-sm border border-[var(--primary)]/5">
          {activity.activityFields?.eventDate && (
            <div className="flex items-center gap-3">
              <span className="text-xl" aria-hidden>📅</span>
              <span>
                {formatDate(activity.activityFields.eventDate, true)}
                {activity.activityFields.eventEndDate &&
                  ` — ${formatDate(activity.activityFields.eventEndDate, true)}`}
              </span>
            </div>
          )}
          {activity.activityFields?.location && (
            <div className="flex items-center gap-3">
              <span className="text-xl" aria-hidden>📍</span>
              <span>{activity.activityFields.location}</span>
            </div>
          )}
        </div>
      </header>

      {activity.content && (
        <div
          className="prose prose-lg max-w-none text-[var(--secondary)] leading-relaxed bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-[var(--primary)]/5 mb-10"
          dangerouslySetInnerHTML={{ __html: activity.content }}
        />
      )}

      <div className="flex flex-col items-center pt-8 border-t border-[var(--primary)]/10">
        {registrationUrl && !isEnded ? (
          <a
            href={registrationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-12 py-4 bg-[var(--primary)] text-white rounded-full font-bold text-xl hover:bg-[var(--secondary)] transition-all shadow-xl hover:scale-105 active:scale-95"
          >
            立即報名
          </a>
        ) : registrationUrl && isEnded ? (
          <div className="text-center">
            <button
              type="button"
              disabled
              className="px-12 py-4 bg-gray-300 text-gray-500 rounded-full font-bold text-xl cursor-not-allowed mb-2"
            >
              立即報名
            </button>
            <p className="text-gray-500 font-medium">報名已截止</p>
          </div>
        ) : null}

        <Link
          href="/activities"
          className="mt-8 text-[var(--primary)] font-bold hover:underline"
        >
          返回活動列表
        </Link>
      </div>
    </article>
  );
}
