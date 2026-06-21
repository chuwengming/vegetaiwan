import Link from "next/link";
import { getActivities, getPromotions } from "@/lib/wordpress";
import {
  getSidebarActivityList,
  getSidebarArticlePromotions,
  getSidebarVideoPromotions,
} from "@/lib/home-filters";

export default async function SidePanel() {
  const [activities, promotions] = await Promise.all([
    getActivities(),
    getPromotions(),
  ]);

  const activityList = getSidebarActivityList(activities, 10);
  const videoPromos = getSidebarVideoPromotions(promotions, 10);
  const articlePromos = getSidebarArticlePromotions(promotions, 10);

  return (
    <aside className="side-panel">
      <div className="side-section">
        <div className="side-section-header">
          <span className="side-section-icon">📅</span>
          <h3 className="side-section-title">活動清單</h3>
        </div>
        <ul className="side-list">
          {activityList.map((item) => (
            <li key={item.id}>
              <Link href={`/activities/${item.slug}`} className="side-list-link">
                <span className="side-list-dot" />
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
        <Link href="/activities" className="side-more-link">
          查看更多活動 →
        </Link>
      </div>

      <div className="side-section">
        <div className="side-section-header">
          <span className="side-section-icon">🎬</span>
          <h3 className="side-section-title">多媒體影音</h3>
        </div>
        <ul className="side-list">
          {videoPromos.map((item) => (
            <li key={item.id}>
              <Link href={`/promotions/${item.slug}`} className="side-list-link">
                <span className="side-list-dot" />
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
        <Link href="/promotions" className="side-more-link">
          查看更多影音 →
        </Link>
      </div>

      <div className="side-section">
        <div className="side-section-header">
          <span className="side-section-icon">📄</span>
          <h3 className="side-section-title">文宣文章</h3>
        </div>
        <ul className="side-list">
          {articlePromos.map((item) => (
            <li key={item.id}>
              <Link href={`/promotions/${item.slug}`} className="side-list-link">
                <span className="side-list-dot" />
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
        <Link href="/promotions" className="side-more-link">
          查看更多文宣 →
        </Link>
      </div>

      <div className="side-section">
        <div className="side-section-header">
          <span className="side-section-icon">🌐</span>
          <h3 className="side-section-title">追蹤我們</h3>
        </div>
        <div className="side-social">
          <a
            href="https://www.instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="side-social-btn ig"
          >
            Instagram
          </a>
          <a
            href="https://www.facebook.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="side-social-btn fb"
          >
            Facebook
          </a>
        </div>
      </div>
    </aside>
  );
}
