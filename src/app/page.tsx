"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { getUserId } from "@/lib/user-id";
import { getCategoryEmoji, formatAmount } from "@/lib/constants";
import AddRecordSheet from "@/components/AddRecordSheet";
import type { Transaction } from "@/lib/types";

export default function HomePage() {
  const [balance, setBalance] = useState(0);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [topExpenses, setTopExpenses] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [sheetOpen, setSheetOpen] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    const userId = getUserId();

    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
      .toISOString()
      .split("T")[0];
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)
      .toISOString()
      .split("T")[0];

    const { data } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", userId)
      .gte("date", firstDay)
      .lte("date", lastDay)
      .order("date", { ascending: false });

    if (data) {
      const inc = data
        .filter((r) => r.type === "income")
        .reduce((s, r) => s + Number(r.amount), 0);
      const exp = data
        .filter((r) => r.type === "expense")
        .reduce((s, r) => s + Number(r.amount), 0);
      setIncome(inc);
      setExpense(exp);
      setBalance(inc - exp);

      const top3 = data
        .filter((r) => r.type === "expense")
        .sort((a, b) => Number(b.amount) - Number(a.amount))
        .slice(0, 3) as Transaction[];
      setTopExpenses(top3);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper">
        <svg width="32" height="32" viewBox="0 0 32 32" className="animate-spin">
          <circle cx="16" cy="16" r="12" fill="none" stroke="#B8A88A" strokeWidth="2"
                  strokeDasharray="60 20" strokeLinecap="round" />
        </svg>
      </div>
    );

  return (
    <div className="min-h-screen bg-paper">
      <div className="max-w-lg mx-auto px-5 pt-5 pb-6">

        {/* ── Balance Card ── */}
        <div className="sketch-card p-6 animate-sketch-in text-center">
          <p className="text-caption text-ink-faint tracking-wider mb-3">本月结余</p>
          <p className="num text-[2.5rem] leading-tight font-bold text-ink mb-5">
            ¥{formatAmount(balance)}
          </p>
          <div className="sketch-divider mb-5" />
          <div className="flex justify-around">
            <div>
              <p className="text-caption text-ink-faint mb-1">收入</p>
              <p className="num text-title font-semibold text-income">+{formatAmount(income)}</p>
            </div>
            <div>
              <p className="text-caption text-ink-faint mb-1">支出</p>
              <p className="num text-title font-semibold text-expense">-{formatAmount(expense)}</p>
            </div>
          </div>
        </div>

        {/* ── Top 3 Expenses ── */}
        {topExpenses.length > 0 && (
          <div className="mt-6">
            <p className="text-caption text-ink-faint tracking-wider mb-3 px-1">本月支出Top3</p>
            <div className="sketch-card p-3">
              {topExpenses.map((t, i) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between py-3"
                  style={{ borderBottom: i < topExpenses.length - 1 ? "1px dashed #D8D0C066" : "none" }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg leading-none">
                      {getCategoryEmoji(t.category)}
                    </span>
                    <div>
                      <p className="text-[14px] text-ink">{t.category}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[12px] text-ink-faint">
                          {formatTime(t.created_at)}
                        </span>
                        {t.note && (
                          <span className="text-[13px] px-1.5 py-0.5 max-w-[140px] truncate" style={{ color: "#6B5D4D", background: "#E8DFC8", borderRadius: "2px 5px 3px 4px", transform: "rotate(-0.5deg)" }}>
                            {t.note}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <span className="num text-caption font-medium text-expense">
                    -{formatAmount(Number(t.amount))}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {topExpenses.length === 0 && (
          <div className="mt-8 text-center">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none"
                 className="mx-auto mb-3 text-ink-faint opacity-40">
              <rect x="6" y="4" width="28" height="32" rx="2"
                    stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 3" />
              <path d="M12 14h16M12 20h10M12 26h13"
                    stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            <p className="text-ink-faint text-caption">暂无记录</p>
          </div>
        )}

        <div className="h-24 safe-bottom" />
      </div>

      {/* ── FAB: 记一笔 ── */}
      <button
        onClick={() => setSheetOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-ink flex items-center justify-center shadow-lg z-40 transition-transform active:scale-95"
      >
        <svg width="26" height="26" fill="none" stroke="#FDF8F0" strokeWidth="2.5" strokeLinecap="round">
          <path d="M13 5v16M5 13h16" />
        </svg>
      </button>

      <AddRecordSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onSaved={loadData}
      />
    </div>
  );
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
