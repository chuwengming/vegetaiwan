import ContactForm from "@/components/ContactForm";
import VegNewsQA from "@/components/VegNewsQA";
import { getPageBySlug, getSiteContact } from "@/lib/wordpress";

export default async function ContactPage() {
  const [page, contact] = await Promise.all([
    getPageBySlug("contact"),
    getSiteContact(),
  ]);

  return (
    <div className="max-w-[var(--max-width)] mx-auto px-4 py-16">
      <div className="flex flex-col lg:flex-row gap-16">
        <div className="w-full lg:w-1/3 space-y-12">
          <header>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[var(--primary)]">
              {page?.title ?? "聯絡我們"}
            </h1>
            {page?.content ? (
              <div
                className="prose text-[var(--secondary)]/70"
                dangerouslySetInnerHTML={{ __html: page.content }}
              />
            ) : (
              <p className="text-xl text-[var(--secondary)]/70">
                有任何建議或合作機會？
                <br />
                歡迎與我們聯繫。
              </p>
            )}
          </header>

          <footer className="space-y-6">
            {contact.contactAddress && (
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-2xl">📍</div>
                <div>
                  <h4 className="font-bold text-[var(--secondary)]">聯絡地址</h4>
                  <p className="text-[var(--secondary)]/70">{contact.contactAddress}</p>
                </div>
              </div>
            )}
            {contact.contactPhone && (
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-2xl">📞</div>
                <div>
                  <h4 className="font-bold text-[var(--secondary)]">服務專線</h4>
                  <p className="text-[var(--secondary)]/70">{contact.contactPhone}</p>
                </div>
              </div>
            )}
            {contact.contactEmail && (
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-2xl">✉️</div>
                <div>
                  <h4 className="font-bold text-[var(--secondary)]">電子信箱</h4>
                  <p className="text-[var(--secondary)]/70">{contact.contactEmail}</p>
                </div>
              </div>
            )}
          </footer>
        </div>

        <div className="w-full lg:w-2/3">
          <ContactForm />
        </div>
      </div>

      <VegNewsQA />
    </div>
  );
}
