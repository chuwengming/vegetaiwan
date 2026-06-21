"use client";

import { useMemo, useState } from "react";
import type { Promotion } from "@/lib/wordpress";
import { normalizePromotionType } from "@/lib/wordpress";
import type { PromotionType } from "@/lib/utils";
import FilterTabs from "./FilterTabs";
import PromotionCard from "./PromotionCard";

type PromotionFilter = "all" | PromotionType;

const FILTER_TABS: { value: PromotionFilter; label: string }[] = [
  { value: "all", label: "全部" },
  { value: "video", label: "影音" },
  { value: "article", label: "文章" },
  { value: "pdf", label: "PDF" },
];

interface PromotionsGridProps {
  promotions: Promotion[];
}

export default function PromotionsGrid({ promotions }: PromotionsGridProps) {
  const [filter, setFilter] = useState<PromotionFilter>("all");

  const filtered = useMemo(() => {
    if (filter === "all") return promotions;
    return promotions.filter((p) => normalizePromotionType(p) === filter);
  }, [promotions, filter]);

  if (promotions.length === 0) {
    return (
      <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-[var(--primary)]/30">
        <p className="text-xl text-[var(--secondary)]/50">目前尚無文宣素材</p>
      </div>
    );
  }

  return (
    <>
      <FilterTabs tabs={FILTER_TABS} active={filter} onChange={setFilter} />

      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-[var(--primary)]/30">
          <p className="text-lg text-[var(--secondary)]/50">此分類目前尚無素材</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((promo) => (
            <PromotionCard key={promo.id} promotion={promo} />
          ))}
        </div>
      )}
    </>
  );
}
