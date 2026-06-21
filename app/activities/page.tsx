import { Suspense } from "react";
import CardSkeleton from "@/components/CardSkeleton";
import ActivitiesGrid from "@/components/ActivitiesGrid";
import { getActivities } from "@/lib/wordpress";

async function ActivitiesContent() {
  const activities = await getActivities();
  return <ActivitiesGrid activities={activities} />;
}

export default function ActivitiesPage() {
  return (
    <div className="max-w-[var(--max-width)] mx-auto px-4 py-16">
      <header className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[var(--primary)]">
          活動專區
        </h1>
        <p className="text-xl text-[var(--secondary)]/70 max-w-2xl mx-auto">
          透過各式多元活動，凝聚社會對蔬食環保的正向認同。
        </p>
      </header>

      <Suspense fallback={<CardSkeleton count={6} />}>
        <ActivitiesContent />
      </Suspense>
    </div>
  );
}
