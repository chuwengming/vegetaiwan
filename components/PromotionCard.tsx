"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Promotion } from "@/lib/wordpress";
import {
  normalizePromotionType,
  getPromotionPdfUrl,
} from "@/lib/wordpress";
import {
  formatDate,
  stripHtml,
  PROMOTION_TYPE_LABELS,
  PROMOTION_TYPE_COLORS,
  parseYouTubeId,
  type PromotionType,
} from "@/lib/utils";
import VideoModal from "./VideoModal";

interface PromotionCardProps {
  promotion: Promotion;
}

export default function PromotionCard({ promotion }: PromotionCardProps) {
  const router = useRouter();
  const [videoOpen, setVideoOpen] = useState(false);

  const type = normalizePromotionType(promotion) as PromotionType;
  const pdfUrl = getPromotionPdfUrl(promotion);
  const videoId = parseYouTubeId(promotion.promotionFields?.videoUrl);
  const excerpt = promotion.excerpt ? stripHtml(promotion.excerpt) : "";

  const handleClick = () => {
    if (type === "video" && videoId) {
      setVideoOpen(true);
      return;
    }
    if (type === "pdf" && pdfUrl) {
      window.open(pdfUrl, "_blank", "noopener,noreferrer");
      return;
    }
    router.push(`/promotions/${promotion.slug}`);
  };

  return (
    <>
      <article
        className="promotion-card cursor-pointer group"
        onClick={handleClick}
        onKeyDown={(e) => e.key === "Enter" && handleClick()}
        role="button"
        tabIndex={0}
      >
        <div className="promotion-card-image">
          {promotion.featuredImage?.node?.sourceUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={promotion.featuredImage.node.sourceUrl}
              alt={promotion.featuredImage.node.altText || promotion.title}
              className="promotion-card-img"
            />
          ) : (
            <div className="promotion-card-img-placeholder bg-[var(--primary)]/5 flex items-center justify-center h-full text-4xl">
              {type === "video" ? "🎬" : type === "pdf" ? "📑" : "📄"}
            </div>
          )}
          <span
            className={`absolute top-3 left-3 px-3 py-1 rounded-full text-white text-xs font-bold ${PROMOTION_TYPE_COLORS[type]}`}
          >
            {PROMOTION_TYPE_LABELS[type]}
          </span>
        </div>

        <div className="promotion-card-body">
          <h3 className="promotion-card-title group-hover:text-[var(--primary)]">
            {promotion.title}
          </h3>
          <p className="text-sm text-[var(--secondary)]/60 mb-2">
            {formatDate(promotion.date)}
          </p>
          {excerpt && (
            <p className="text-[var(--secondary)]/80 line-clamp-2 text-sm leading-relaxed">
              {excerpt}
            </p>
          )}
        </div>
      </article>

      {videoOpen && videoId && (
        <VideoModal
          videoId={videoId}
          title={promotion.title}
          onClose={() => setVideoOpen(false)}
        />
      )}
    </>
  );
}
