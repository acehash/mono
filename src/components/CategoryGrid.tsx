"use client";

import { getCategoryEmoji } from "@/lib/constants";

interface CategoryGridProps {
  categories: string[];
  selected: string | null;
  onSelect: (name: string) => void;
}

export default function CategoryGrid({
  categories,
  selected,
  onSelect,
}: CategoryGridProps) {
  return (
    <div className="grid grid-cols-4 gap-2 p-2">
      {categories.map((name) => (
        <button
          key={name}
          onClick={() => onSelect(name)}
          className={`flex flex-col items-center gap-1 p-2 transition-all duration-150 ${
            selected === name
              ? "sketch-pill bg-accent/10 border-accent text-accent"
              : "sketch-button bg-paper-warm text-ink-light hover:text-ink"
          }`}
        >
          <span className="text-2xl leading-none">{getCategoryEmoji(name)}</span>
          <span className="text-[13px] leading-tight">{name}</span>
        </button>
      ))}
    </div>
  );
}
