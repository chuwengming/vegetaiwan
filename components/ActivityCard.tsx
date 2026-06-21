import Link from "next/link";
import type { Activity } from "@/lib/wordpress";
import {
  formatDate,
  stripHtml,
  resolveActivityStatus,
  ACTIVITY_STATUS_LABELS,
  ACTIVITY_STATUS_COLORS,
} from "@/lib/utils";

interface ActivityCardProps {
  activity: Activity;
}

export default function ActivityCard({ activity }: ActivityCardProps) {
  const status = resolveActivityStatus(
    activity.activityFields?.eventDate,
    activity.activityFields?.eventEndDate,
    activity.activityFields?.activityStatus
  );
  const excerpt = activity.excerpt ? stripHtml(activity.excerpt) : "";
  const eventDate = activity.activityFields?.eventDate;

  return (
    <Link href={`/activities/${activity.slug}`} className="block group">
      <article className="activity-card h-full">
        <div className="activity-card-image">
          {activity.featuredImage?.node?.sourceUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={activity.featuredImage.node.sourceUrl}
              alt={activity.featuredImage.node.altText || activity.title}
              className="activity-card-img"
            />
          ) : (
            <div className="activity-card-img-placeholder bg-[var(--primary)]/5 flex items-center justify-center h-full text-4xl">
              🌿
            </div>
          )}
          <span
            className={`absolute top-3 left-3 px-3 py-1 rounded-full text-white text-xs font-bold ${ACTIVITY_STATUS_COLORS[status]}`}
          >
            {ACTIVITY_STATUS_LABELS[status]}
          </span>
        </div>

        <div className="activity-card-body">
          <h3 className="activity-card-title group-hover:text-[var(--primary)]">
            {activity.title}
          </h3>

          <div className="space-y-1 mb-3 text-sm text-[var(--secondary)]/70">
            {eventDate && (
              <p className="flex items-center gap-2">
                <span aria-hidden>📅</span>
                {formatDate(eventDate, true)}
              </p>
            )}
            {activity.activityFields?.location && (
              <p className="flex items-center gap-2">
                <span aria-hidden>📍</span>
                {activity.activityFields.location}
              </p>
            )}
          </div>

          {excerpt && (
            <p className="text-[var(--secondary)]/80 line-clamp-2 text-sm leading-relaxed">
              {excerpt}
            </p>
          )}
        </div>
      </article>
    </Link>
  );
}
