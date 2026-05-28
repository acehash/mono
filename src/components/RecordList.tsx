"use client";

import { useState, useRef, useCallback } from "react";
import { getCategoryEmoji, formatAmount } from "@/lib/constants";
import type { TransactionWithCategory } from "@/lib/types";

interface RecordListProps {
  records: TransactionWithCategory[];
  filter?: "all" | "expense" | "income";
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
}

interface DayGroup {
  date: string;
  income: number;
  expense: number;
  records: TransactionWithCategory[];
}

export default function RecordList({ records, filter = "all", onDelete, onEdit }: RecordListProps) {
  const [swipedId, setSwipedId] = useState<string | null>(null);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const touchCurrentX = useRef(0);
  const isSwiping = useRef(false);

  const groups: DayGroup[] = [];
  records.forEach((r) => {
    const existing = groups.find((g) => g.date === r.date);
    if (existing) {
      existing.records.push(r);
      if (r.type === "income") existing.income += Number(r.amount);
      else existing.expense += Number(r.amount);
    } else {
      groups.push({
        date: r.date,
        income: r.type === "income" ? Number(r.amount) : 0,
        expense: r.type === "expense" ? Number(r.amount) : 0,
        records: [r],
      });
    }
  });

  const handleTouchStart = useCallback((e: React.TouchEvent, id: string) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    touchCurrentX.current = e.touches[0].clientX;
    isSwiping.current = false;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent, id: string) => {
    const deltaX = e.touches[0].clientX - touchStartX.current;
    const deltaY = e.touches[0].clientY - touchStartY.current;

    if (!isSwiping.current && Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
      isSwiping.current = true;
    }

    if (isSwiping.current) {
      e.preventDefault();
      touchCurrentX.current = e.touches[0].clientX;
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
        el.style.transform = "translateX(-160px)";
        setSwipedId(id);
      } else {
        el.style.transform = "translateX(0)";
        setSwipedId((prev) => (prev === id ? null : prev));
      }
    }

    isSwiping.current = false;
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
      <div className="text-center py-12">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none"
             className="mx-auto mb-3 text-ink-faint opacity-40">
          <rect x="6" y="4" width="28" height="32" rx="2"
                stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 3" />
          <path d="M12 14h16M12 20h10M12 26h13"
                stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
        <p className="text-ink-faint text-caption">本月暂无记录</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {groups.map((group) => {
        const net = group.income - group.expense;

        return (
          <div key={group.date} className="animate-fade-up sketch-card p-3">
            {/* Day header with daily total */}
            <div className="flex justify-between items-baseline mb-2 px-1">
              <span className="text-caption text-ink-faint tracking-wider">
                {formatDate(group.date)}
              </span>
              <div className="flex items-baseline gap-3">
                {filter === "all" ? (
                  <span className={`text-body num font-semibold ${net >= 0 ? "text-income" : "text-expense"}`}>
                    {net >= 0 ? "+" : ""}{formatAmount(net)}
                  </span>
                ) : (
                  <>
                    {group.income > 0 && (
                      <span className="text-body num font-semibold text-income">
                        +{formatAmount(group.income)}
                      </span>
                    )}
                    {group.expense > 0 && (
                      <span className="text-body num font-semibold text-expense">
                        -{formatAmount(group.expense)}
                      </span>
                    )}
                  </>
                )}
              </div>
            </div>

            <div className="space-y-0">
              {group.records.map((r, i) => (
                <div key={r.id} className="relative overflow-hidden">
                  <div className="absolute right-0 top-0 bottom-0 flex">
                    <button
                      className="bg-accent text-paper-highlight px-6 flex items-center text-caption font-medium"
                      onClick={() => handleEdit(r.id)}
                    >
                      编辑
                    </button>
                    <button
                      className="bg-expense text-paper-highlight px-6 flex items-center text-caption font-medium"
                      onClick={() => handleDelete(r.id)}
                    >
                      删除
                    </button>
                  </div>

                  <div
                    id={`record-card-${r.id}`}
                    className="flex items-center justify-between py-3 px-1 relative bg-paper"
                    style={{
                      borderBottom: i < group.records.length - 1
                        ? "1px dashed #D8D0C066"
                        : "none",
                    }}
                    onTouchStart={(e) => handleTouchStart(e, r.id)}
                    onTouchMove={(e) => handleTouchMove(e, r.id)}
                    onTouchEnd={() => handleTouchEnd(r.id)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg leading-none">
                        {getCategoryEmoji(r.categories?.name || "")}
                      </span>
                      <div className="flex flex-col">
                        <span className="text-[14px] text-ink">
                          {r.categories?.name || "未分类"}
                        </span>
                        <span className="text-[12px] text-ink-faint">
                          {formatTime(r.created_at)}
                          {r.note && ` · ${r.note}`}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`num text-caption font-medium ${
                        r.type === "income" ? "text-income" : "text-expense"
                      }`}
                    >
                      {r.type === "income" ? "+" : "-"}{formatAmount(Number(r.amount))}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
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
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const recordDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  const diffDays = Math.floor((today.getTime() - recordDate.getTime()) / 86400000);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const time = `${hours}:${minutes}`;

  if (diffDays === 0) return `今天 ${time}`;
  if (diffDays === 1) return `昨天 ${time}`;
  return `${date.getMonth() + 1}/${date.getDate()} ${time}`;
}
