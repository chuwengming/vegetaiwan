import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPromotionBySlug, normalizePromotionType } from "@/lib/wordpress";
import {
  formatDate,
  parseYouTubeId,
  PROMOTION_TYPE_LABELS,
  PROMOTION_TYPE_COLORS,
  type PromotionType,
} from "@/lib/utils";

export default async function PromotionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const promotion = await getPromotionBySlug(slug);

  if (!promotion) {
    notFound();
  }

  const type = normalizePromotionType(promotion) as PromotionType;
  const videoId = parseYouTubeId(promotion.promotionFields?.videoUrl);

  return (
    <article className="max-w-[900px] mx-auto px-4 py-16">
      <Link
        href="/promotions"
        className="text-[var(--primary)] font-bold mb-8 inline-block hover:translate-x-[-4px] transition-transform"
      >
        ← 返回文宣列表
      </Link>

      <header className="mb-8">
        <span
          className={`inline-block px-3 py-1 rounded-full text-white text-sm font-bold mb-4 ${PROMOTION_TYPE_COLORS[type]}`}
        >
          {PROMOTION_TYPE_LABELS[type]}
        </span>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[var(--secondary)]">
          {promotion.title}
        </h1>
        <p className="text-[var(--secondary)]/60">{formatDate(promotion.date)}</p>
      </header>

      {promotion.featuredImage?.node?.sourceUrl && (
        <div className="relative h-[250px] md:h-[420px] w-full rounded-3xl overflow-hidden mb-10 shadow-xl">
          <Image
            src={promotion.featuredImage.node.sourceUrl}
            alt={promotion.featuredImage.node.altText || promotion.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {type === "video" && videoId && (
        <div className="relative aspect-video w-full rounded-3xl overflow-hidden mb-10 shadow-xl bg-black">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            title={promotion.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full border-0"
          />
        </div>
      )}

      {promotion.content && (
        <div
          className="prose prose-lg max-w-none text-[var(--secondary)] leading-relaxed bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-[var(--primary)]/5"
          dangerouslySetInnerHTML={{ __html: promotion.content }}
        />
      )}
    </article>
  );
}
