"use client";

interface CategoryRankingProps {
  data: { name: string; value: number; color: string }[];
  total: number;
}

export default function CategoryRanking({
  data,
  total,
}: CategoryRankingProps) {
  if (data.length === 0) return null;

  return (
    <div className="space-y-2 px-4 mt-3">
      {data.map((item) => (
        <div key={item.name} className="flex items-center gap-3">
          <div
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{ backgroundColor: item.color }}
          />
          <span className="flex-1 text-sm">{item.name}</span>
          <span className="text-sm text-gray-500">
            {total > 0 ? ((item.value / total) * 100).toFixed(1) : 0}%
          </span>
          <span className="text-sm font-hand font-bold">
            ¥{item.value.toFixed(2)}
          </span>
        </div>
      ))}
    </div>
  );
}
