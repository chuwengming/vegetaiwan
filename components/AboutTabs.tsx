"use client";

import { useState } from "react";
import type { AboutSection, AboutSectionId } from "@/lib/about-content";

interface AboutTabsProps {
  sections: AboutSection[];
}

export default function AboutTabs({ sections }: AboutTabsProps) {
  const [activeId, setActiveId] = useState<AboutSectionId>(sections[0]?.id ?? "intro");
  const active = sections.find((section) => section.id === activeId) ?? sections[0];

  if (!active) return null;

  return (
    <div className="about-tabs">
      <div
        className="about-tab-list"
        role="tablist"
        aria-label="關於社團分頁"
      >
        {sections.map((section) => {
          const isActive = section.id === activeId;
          return (
            <button
              key={section.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`about-panel-${section.id}`}
              id={`about-tab-${section.id}`}
              className={`about-tab-btn ${isActive ? "is-active" : ""}`}
              onClick={() => setActiveId(section.id)}
            >
              {section.label}
            </button>
          );
        })}
      </div>

      <div
        id={`about-panel-${active.id}`}
        role="tabpanel"
        aria-labelledby={`about-tab-${active.id}`}
        className="about-tab-panel"
      >
        <div
          className="about-tab-content prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: active.html }}
        />
      </div>
    </div>
  );
}
