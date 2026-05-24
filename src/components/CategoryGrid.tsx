"use client";

import type { Category } from "@/lib/types";

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
    <div className="grid grid-cols-4 gap-3 p-4">
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className={`flex flex-col items-center gap-1 p-3 rounded-xl transition ${
            selected === cat.id
              ? "bg-expense/10 ring-2 ring-expense"
              : "bg-gray-50 dark:bg-gray-800 active:bg-gray-100"
          }`}
        >
          <span className="text-2xl">{getCategoryEmoji(cat.icon)}</span>
          <span className="text-xs">{cat.name}</span>
        </button>
      ))}
    </div>
  );
}

function getCategoryEmoji(icon: string): string {
  const map: Record<string, string> = {
    utensils: "🍽️",
    bus: "🚌",
    "shopping-bag": "🛍️",
    home: "🏠",
    gamepad: "🎮",
    heart: "❤️",
    book: "📚",
    more: "•••",
    briefcase: "💼",
    trophy: "🏆",
    chart: "📈",
    tool: "🔧",
    gift: "🎁",
  };
  return map[icon] || "📌";
}
