"use client";

import type { TransactionWithCategory } from "@/lib/types";

interface RecordListProps {
  records: TransactionWithCategory[];
  onDelete?: (id: string) => void;
}

interface DayGroup {
  date: string;
  total: number;
  records: TransactionWithCategory[];
}

export default function RecordList({ records, onDelete }: RecordListProps) {
  // 按日期分组
  const groups: DayGroup[] = [];
  records.forEach((r) => {
    const existing = groups.find((g) => g.date === r.date);
    if (existing) {
      existing.records.push(r);
      existing.total +=
        r.type === "income" ? Number(r.amount) : -Number(r.amount);
    } else {
      groups.push({
        date: r.date,
        total:
          r.type === "income" ? Number(r.amount) : -Number(r.amount),
        records: [r],
      });
    }
  });

  if (records.length === 0) {
    return (
      <div className="text-center text-gray-400 py-12 text-sm">
        本月暂无记录
      </div>
    );
  }

  return (
    <div className="space-y-4 px-4">
      {groups.map((group) => (
        <div key={group.date}>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-500">{formatDate(group.date)}</span>
            <span
              className={`text-sm font-hand font-bold ${
                group.total >= 0 ? "text-income" : "text-expense"
              }`}
            >
              {group.total >= 0 ? "+" : ""}¥{group.total.toFixed(2)}
            </span>
          </div>
          <div className="space-y-2">
            {group.records.map((r) => (
              <div
                key={r.id}
                className="card-handdrawn flex items-center justify-between p-3"
                onClick={() => onDelete?.(r.id)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">
                    {r.categories?.name || "未分类"}
                  </span>
                  {r.note && (
                    <span className="text-sm text-gray-400 truncate max-w-[120px]">
                      {r.note}
                    </span>
                  )}
                </div>
                <span
                  className={`font-hand font-bold ${
                    r.type === "income" ? "text-income" : "text-expense"
                  }`}
                >
                  {r.type === "income" ? "+" : "-"}¥
                  {Number(r.amount).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.getTime() === today.getTime()) return "今天";
  if (date.getTime() === yesterday.getTime()) return "昨天";

  return `${date.getMonth() + 1}月${date.getDate()}日`;
}
