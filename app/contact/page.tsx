import VegNewsQA from "@/components/VegNewsQA";
import {
  CONTACT_PAGE_TITLE,
  CONTACT_PAGE_INTRO_HTML,
} from "@/lib/contact-content";
import { getPageBySlug } from "@/lib/wordpress";

const CONTACT_PHONE = "0952415738";
const CONTACT_EMAIL = "chuwmveg@gmail.com";

export default async function ContactPage() {
  const page = await getPageBySlug("contact");

  return (
    <div className="contact-page">
      <div className="max-w-[var(--max-width)] mx-auto px-4 py-12 md:py-16">
        <header className="contact-page-header">
          <p className="contact-page-eyebrow">Contact Us</p>
          <h1 className="contact-page-title">
            {page?.title ?? CONTACT_PAGE_TITLE}
          </h1>
          {page?.content ? (
            <div
              className="contact-page-intro prose prose-lg max-w-none text-[var(--secondary)]/75"
              dangerouslySetInnerHTML={{ __html: page.content }}
            />
          ) : (
            <div
              className="contact-page-lead prose prose-lg max-w-none text-[var(--secondary)]/75"
              dangerouslySetInnerHTML={{ __html: CONTACT_PAGE_INTRO_HTML }}
            />
          )}
        </header>

        <div className="contact-page-grid">
          <aside className="contact-info-panel">
            <div className="contact-info-card">
              <h2 className="contact-info-heading">聯絡方式</h2>
              <p className="contact-info-desc">
                我們重視每一則訊息，將於工作時間內盡快回覆您的來電與信件。
              </p>

              <ul className="contact-method-list">
                <li className="contact-method-item">
                  <span className="contact-method-icon" aria-hidden="true">
                    <PhoneIcon />
                  </span>
                  <div>
                    <h3 className="contact-method-label">連絡電話</h3>
                    <a href={`tel:${CONTACT_PHONE}`} className="contact-method-value">
                      {CONTACT_PHONE}
                    </a>
                  </div>
                </li>
                <li className="contact-method-item">
                  <span className="contact-method-icon" aria-hidden="true">
                    <MailIcon />
                  </span>
                  <div>
                    <h3 className="contact-method-label">電子信箱</h3>
                    <a href={`mailto:${CONTACT_EMAIL}`} className="contact-method-value">
                      {CONTACT_EMAIL}
                    </a>
                  </div>
                </li>
              </ul>
            </div>

            <div className="contact-info-note">
              <p>
                臺中市蔬食台灣促進會致力推動全民蔬食，若您對活動合作、媒體採訪或志工參與有興趣，歡迎隨時與我們聯繫。
              </p>
            </div>
          </aside>

          <div className="contact-qa-panel">
            <VegNewsQA layout="sidebar" />
          </div>
        </div>
      </div>
    </div>
  );
}

function PhoneIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}
