"use client";

interface FilterTabsProps<T extends string> {
  tabs: { value: T; label: string }[];
  active: T;
  onChange: (value: T) => void;
}

export default function FilterTabs<T extends string>({
  tabs,
  active,
  onChange,
}: FilterTabsProps<T>) {
  return (
    <div className="flex flex-wrap justify-center gap-3 mb-12">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          onClick={() => onChange(tab.value)}
          className={`px-5 py-2 rounded-full font-bold transition-colors cursor-pointer ${
            active === tab.value
              ? "bg-[var(--primary)] text-white shadow-md"
              : "bg-white text-[var(--secondary)] border border-[var(--primary)]/10 hover:border-[var(--primary)]"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
