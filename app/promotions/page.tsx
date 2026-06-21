import { Suspense } from "react";
import CardSkeleton from "@/components/CardSkeleton";
import PromotionsGrid from "@/components/PromotionsGrid";
import { getPromotions } from "@/lib/wordpress";

async function PromotionsContent() {
  const promotions = await getPromotions();
  return <PromotionsGrid promotions={promotions} />;
}

export default function PromotionsPage() {
  return (
    <div className="max-w-[var(--max-width)] mx-auto px-4 py-16">
      <header className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[var(--primary)]">
          文宣專區
        </h1>
        <p className="text-xl text-[var(--secondary)]/70 max-w-2xl mx-auto">
          透過豐富的影音、文章與 PDF 素材，傳遞蔬食環保理念。
        </p>
      </header>

      <Suspense fallback={<CardSkeleton count={6} />}>
        <PromotionsContent />
      </Suspense>
    </div>
  );
}
