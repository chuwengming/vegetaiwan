import AboutTabs from "@/components/AboutTabs";
import { parseAboutSectionsFromHtml } from "@/lib/parse-about-sections";
import { getPageBySlug } from "@/lib/wordpress";

export default async function AboutPage() {
  const page = await getPageBySlug("about");
  const sections = parseAboutSectionsFromHtml(page?.content);

  return (
    <div className="max-w-[var(--max-width)] mx-auto px-4 py-16">
      <div className="max-w-[960px] mx-auto">
        <header className="mb-12 text-center">
          <p className="about-page-eyebrow">About Us</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[var(--primary)]">
            {page?.title ?? "關於社團"}
          </h1>
          <p className="text-xl text-[var(--secondary)]/70 max-w-2xl mx-auto leading-relaxed">
            蔬食台灣促進會：為了生命、為了地球、為了和平。
          </p>
        </header>

        <section className="about-page-card">
          <AboutTabs sections={sections} />
        </section>
      </div>
    </div>
  );
}
