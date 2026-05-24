"use client";

import { useState, useRef, useCallback } from "react";
import type { TransactionWithCategory } from "@/lib/types";

interface RecordListProps {
  records: TransactionWithCategory[];
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
}

interface DayGroup {
  date: string;
  total: number;
  records: TransactionWithCategory[];
}

export default function RecordList({ records, onDelete, onEdit }: RecordListProps) {
  const [swipedId, setSwipedId] = useState<string | null>(null);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const touchCurrentX = useRef(0);
  const isSwiping = useRef(false);
  const currentSwipeId = useRef<string | null>(null);

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

  const handleTouchStart = useCallback((e: React.TouchEvent, id: string) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    touchCurrentX.current = e.touches[0].clientX;
    isSwiping.current = false;
    currentSwipeId.current = id;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent, id: string) => {
    const deltaX = e.touches[0].clientX - touchStartX.current;
    const deltaY = e.touches[0].clientY - touchStartY.current;

    // Determine if this is a horizontal swipe (not vertical scroll)
    if (!isSwiping.current && Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
      isSwiping.current = true;
    }

    if (isSwiping.current) {
      e.preventDefault();
      touchCurrentX.current = e.touches[0].clientX;

      // Calculate offset: swipe left = negative, clamped to [-160, 0]
      const offset = Math.min(0, Math.max(-160, deltaX));
      const el = document.getElementById(`record-card-${id}`);
      if (el) {
        el.style.transition = "none";
        el.style.transform = `translateX(${offset}px)`;
      }
    }
  }, []);

  const handleTouchEnd = useCallback((id: string) => {
    if (!isSwiping.current) return;

    const deltaX = touchCurrentX.current - touchStartX.current;
    const el = document.getElementById(`record-card-${id}`);
    if (el) {
      el.style.transition = "transform 0.25s ease";
      if (deltaX < -80) {
        // Snap open
        el.style.transform = "translateX(-160px)";
        setSwipedId(id);
      } else {
        // Snap closed
        el.style.transform = "translateX(0)";
        setSwipedId((prev) => (prev === id ? null : prev));
      }
    }

    isSwiping.current = false;
    currentSwipeId.current = null;
  }, []);

  const resetSwipe = useCallback((id: string) => {
    const el = document.getElementById(`record-card-${id}`);
    if (el) {
      el.style.transition = "transform 0.25s ease";
      el.style.transform = "translateX(0)";
    }
    setSwipedId((prev) => (prev === id ? null : prev));
  }, []);

  const handleEdit = useCallback((id: string) => {
    resetSwipe(id);
    onEdit?.(id);
  }, [onEdit, resetSwipe]);

  const handleDelete = useCallback((id: string) => {
    resetSwipe(id);
    onDelete?.(id);
  }, [onDelete, resetSwipe]);

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
              <div key={r.id} className="relative overflow-hidden rounded-xl">
                {/* Action buttons (behind the card) */}
                <div className="absolute right-0 top-0 bottom-0 flex">
                  <button
                    className="bg-blue-500 text-white px-6 flex items-center text-sm font-medium"
                    onClick={() => handleEdit(r.id)}
                  >
                    编辑
                  </button>
                  <button
                    className="bg-red-500 text-white px-6 flex items-center text-sm font-medium"
                    onClick={() => handleDelete(r.id)}
                  >
                    删除
                  </button>
                </div>
                {/* The sliding card */}
                <div
                  id={`record-card-${r.id}`}
                  className="card-handdrawn flex items-center justify-between p-3 relative bg-white dark:bg-gray-900"
                  onTouchStart={(e) => handleTouchStart(e, r.id)}
                  onTouchMove={(e) => handleTouchMove(e, r.id)}
                  onTouchEnd={() => handleTouchEnd(r.id)}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">
                      {getCategoryEmoji(r.categories?.icon)}
                    </span>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">
                        {r.categories?.name || "未分类"}
                      </span>
                      <span className="text-xs text-gray-400">
                        {formatTime(r.created_at)}
                        {r.note && ` · ${r.note}`}
                      </span>
                    </div>
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

function formatTime(createdAt: string): string {
  const date = new Date(createdAt);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

function getCategoryEmoji(icon?: string): string {
  if (!icon) return "📌";
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
