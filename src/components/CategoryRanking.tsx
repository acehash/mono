"use client";

import { getCategoryEmoji, formatAmount } from "@/lib/constants";

interface CategoryRankingProps {
  data: { name: string; value: number; color: string }[];
  total: number;
}

export default function CategoryRanking({ data, total }: CategoryRankingProps) {
  if (data.length === 0) return null;

  return (
    <div className="space-y-3">
      {data.map((item, i) => {
        const pct = total > 0 ? (item.value / total) * 100 : 0;
        return (
          <div key={item.name} className="stagger-item">
            <div className="flex items-center gap-3">
              <span className="text-lg leading-none">
                {getCategoryEmoji(item.name)}
              </span>
              <span className="flex-1 text-body text-ink">{item.name}</span>
              <span className="text-caption text-ink-faint num">
                {pct.toFixed(1)}%
              </span>
              <span className="text-caption num text-ink">
                ¥{formatAmount(item.value)}
              </span>
            </div>
            {/* Hand-drawn progress bar */}
            <div className="mt-1.5 ml-9 h-[3px] bg-paper-warm overflow-hidden"
              style={{ borderRadius: "1px 2px 1px 2px" }}
            >
              <div
                className="h-full transition-all duration-500 ease-out"
                style={{
                  width: `${Math.min(pct, 100)}%`,
                  backgroundColor: item.color,
                  borderRadius: "1px 2px 1px 2px",
                  filter: "url(#sketchy)",
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
