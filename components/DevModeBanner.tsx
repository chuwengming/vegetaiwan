import { isMockDataMode } from "@/lib/wordpress";

export default function DevModeBanner() {
  if (process.env.NODE_ENV !== "development" || !isMockDataMode()) {
    return null;
  }

  return (
    <div
      className="bg-amber-500 text-amber-950 text-center text-sm py-1.5 font-medium"
      role="status"
    >
      開發模式：Mock 資料（未連線 WordPress）
    </div>
  );
}
