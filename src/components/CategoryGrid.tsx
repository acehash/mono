"use client";

import { getCategoryEmoji } from "@/lib/constants";
import type { Category } from "@/lib/types";

function CategoryIcon({ name }: { name: string; selected: boolean }) {
  const emoji = getCategoryEmoji(name);
  return <span className="text-2xl leading-none">{emoji}</span>;
}

interface CategoryGridProps {
  categories: Category[];
  selected: string | null;
  onSelect: (id: string) => void;
}

export default function CategoryGrid({
  categories,
  selected,
  onSelect,
}: CategoryGridProps) {
  return (
    <div className="grid grid-cols-4 gap-2 p-2">
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className={`flex flex-col items-center gap-1 p-2 transition-all duration-150 ${
            selected === cat.id
              ? "sketch-pill bg-accent/10 border-accent text-accent"
              : "sketch-button bg-paper-warm text-ink-light hover:text-ink"
          }`}
        >
          <CategoryIcon name={cat.name} selected={selected === cat.id} />
          <span className="text-[13px] leading-tight">{cat.name}</span>
        </button>
      ))}
    </div>
  );
}
