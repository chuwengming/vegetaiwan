import Link from 'next/link';
import SocialLinks from '@/components/SocialLinks';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        {/* 社團資訊 */}
        <div className="footer-section">
          <h3 className="footer-title">蔬食台灣促進會</h3>
          <p className="footer-mission">
            推廣全民蔬食，建立和平及綠色環保的社會
          </p>
          <p className="footer-mission">
            彰顯蔬食環保意識、愛護動物宣傳
          </p>
        </div>

        {/* 快速連結 */}
        <div className="footer-section">
          <h4 className="footer-subtitle">快速連結</h4>
          <ul className="footer-links">
            <li><Link href="/about" className="footer-link">社團介紹</Link></li>
            <li><Link href="/activities" className="footer-link">社團活動</Link></li>
            <li><Link href="/promotions" className="footer-link">文宣專區</Link></li>
            <li><Link href="/contact" className="footer-link">聯絡我們</Link></li>
          </ul>
        </div>

        {/* 社群媒體 */}
        <div className="footer-section">
          <h4 className="footer-subtitle">追蹤關注</h4>
          <SocialLinks variant="footer" />
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} 蔬食台灣促進會 版權所有</p>
        <p className="footer-motto">🌱 用蔬食，愛地球，護眾生</p>
      </div>
    </footer>
  );
}
