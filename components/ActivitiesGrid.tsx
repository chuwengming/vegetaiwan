"use client";

import { useMemo, useState } from "react";
import type { Activity } from "@/lib/wordpress";
import { resolveActivityStatus, type ActivityStatus } from "@/lib/utils";
import FilterTabs from "./FilterTabs";
import ActivityCard from "./ActivityCard";

type ActivityFilter = "all" | ActivityStatus;

const FILTER_TABS: { value: ActivityFilter; label: string }[] = [
  { value: "all", label: "全部" },
  { value: "upcoming", label: "即將舉行" },
  { value: "ongoing", label: "進行中" },
  { value: "ended", label: "已結束" },
];

interface ActivitiesGridProps {
  activities: Activity[];
}

export default function ActivitiesGrid({ activities }: ActivitiesGridProps) {
  const [filter, setFilter] = useState<ActivityFilter>("all");

  const filtered = useMemo(() => {
    if (filter === "all") return activities;
    return activities.filter(
      (a) =>
        resolveActivityStatus(
          a.activityFields?.eventDate,
          a.activityFields?.eventEndDate,
          a.activityFields?.activityStatus
        ) === filter
    );
  }, [activities, filter]);

  if (activities.length === 0) {
    return (
      <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-[var(--primary)]/30">
        <p className="text-xl text-[var(--secondary)]/50">目前尚無活動資訊</p>
      </div>
    );
  }

  return (
    <>
      <FilterTabs tabs={FILTER_TABS} active={filter} onChange={setFilter} />

      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-[var(--primary)]/30">
          <p className="text-lg text-[var(--secondary)]/50">此狀態目前尚無活動</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </div>
      )}
    </>
  );
}
