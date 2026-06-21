import SidePanel from "@/components/SidePanel";
import ActivityCard from "@/components/ActivityCard";
import PromotionCard from "@/components/PromotionCard";
import { getActivities, getPromotions } from "@/lib/wordpress";
import {
  getHomeFeaturedActivities,
  getHomeFeaturedPromotions,
} from "@/lib/home-filters";
import Link from "next/link";

export default async function Home() {
  const [allActivities, allPromotions] = await Promise.all([
    getActivities(),
    getPromotions(),
  ]);

  const activities = getHomeFeaturedActivities(allActivities, 2);
  const promotions = getHomeFeaturedPromotions(allPromotions, 2);

  return (
    <div className="flex flex-col w-full">
      <div className="max-w-[var(--max-width)] mx-auto px-4 py-12 w-full">
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="w-full lg:w-1/4">
            <SidePanel />
          </div>

          <div className="w-full lg:w-3/4 info-panel-container">
            <section className="info-section">
              <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-[var(--primary-light)] to-[var(--accent)]" />
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold flex items-center gap-3">
                  <span className="text-4xl text-[var(--primary)]">📅</span>
                  最新活動
                </h2>
                <Link href="/activities" className="text-[var(--primary)] hover:underline font-bold">
                  所有活動 →
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {activities.length > 0 ? (
                  activities.map((activity) => (
                    <ActivityCard key={activity.id} activity={activity} />
                  ))
                ) : (
                  <p className="text-[var(--secondary)]/60 col-span-full">
                    近半年內尚無活動，請至活動專區查看完整列表。
                  </p>
                )}
              </div>
            </section>

            <section className="info-section">
              <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-blue-400 to-blue-600" />
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold flex items-center gap-3">
                  <span className="text-4xl text-[var(--accent)]">📜</span>
                  最新文宣
                </h2>
                <Link href="/promotions" className="text-[var(--primary)] hover:underline font-bold">
                  更多文宣 →
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {promotions.length > 0 ? (
                  promotions.map((promo) => (
                    <PromotionCard key={promo.id} promotion={promo} />
                  ))
                ) : (
                  <p className="text-[var(--secondary)]/60 col-span-full">
                    近半年內尚無文宣，請至文宣專區查看完整列表。
                  </p>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
