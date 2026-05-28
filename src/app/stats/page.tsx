"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { getUserId } from "@/lib/user-id";
import { getCategoryColor } from "@/lib/constants";
import MonthPicker from "@/components/MonthPicker";
import CategoryChart from "@/components/CategoryChart";
import CategoryRanking from "@/components/CategoryRanking";
import TrendChart from "@/components/TrendChart";

interface CategoryData {
  name: string;
  value: number;
  color: string;
}

export default function StatsPage() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [expenseByCategory, setExpenseByCategory] = useState<CategoryData[]>([]);
  const [incomeByCategory, setIncomeByCategory] = useState<CategoryData[]>([]);
  const [trendData, setTrendData] = useState<
    { month: string; income: number; expense: number }[]
  >([]);

  const loadData = useCallback(async () => {
    const userId = getUserId();

    const firstDay = new Date(year, month - 1, 1)
      .toISOString()
      .split("T")[0];
    const lastDay = new Date(year, month, 0)
      .toISOString()
      .split("T")[0];

    const now2 = new Date();
    const earliestMonth = new Date(now2.getFullYear(), now2.getMonth() - 5, 1);
    const rangeStart = earliestMonth.toISOString().split("T")[0];
    const rangeEnd = new Date(now2.getFullYear(), now2.getMonth() + 1, 0)
      .toISOString()
      .split("T")[0];

    const [{ data: monthRecords }, { data: trendRecords }] = await Promise.all([
      supabase
        .from("transactions")
        .select("*")
        .eq("user_id", userId)
        .gte("date", firstDay)
        .lte("date", lastDay),
      supabase
        .from("transactions")
        .select("type, amount, date")
        .eq("user_id", userId)
        .gte("date", rangeStart)
        .lte("date", rangeEnd),
    ]);

    if (monthRecords) {
      const groupByCategory = (type: "income" | "expense") => {
        const filtered = monthRecords.filter((r) => r.type === type);
        const map = new Map<string, number>();
        filtered.forEach((r) => {
          const name = r.category;
          map.set(name, (map.get(name) || 0) + Number(r.amount));
        });
        return Array.from(map.entries())
          .sort((a, b) => b[1] - a[1])
          .map(([name, value]) => ({
            name,
            value,
            color: getCategoryColor(name),
          }));
      };

      setExpenseByCategory(groupByCategory("expense"));
      setIncomeByCategory(groupByCategory("income"));
    }

    const monthBuckets = new Map<string, { income: number; expense: number }>();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now2.getFullYear(), now2.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      monthBuckets.set(key, { income: 0, expense: 0 });
    }

    trendRecords?.forEach((r) => {
      const d = new Date(r.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const bucket = monthBuckets.get(key);
      if (bucket) {
        if (r.type === "income") bucket.income += Number(r.amount);
        else bucket.expense += Number(r.amount);
      }
    });

    const trend: { month: string; income: number; expense: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now2.getFullYear(), now2.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const bucket = monthBuckets.get(key)!;
      trend.push({
        month: `${d.getMonth() + 1}月`,
        income: bucket.income,
        expense: bucket.expense,
      });
    }
    setTrendData(trend);
  }, [year, month]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const expenseTotal = expenseByCategory.reduce((sum, d) => sum + d.value, 0);
  const incomeTotal = incomeByCategory.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="min-h-screen bg-paper">
      <div className="max-w-lg mx-auto px-4 pb-6">
        {/* ── Trend Card — fixed last 6 months ── */}
        <div className="sketch-card p-5 animate-sketch-in">
          <div className="flex items-center gap-2 mb-4">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-ink-faint">
              <rect x="1" y="3" width="12" height="8" rx="1" stroke="currentColor" strokeWidth="1.2" />
              <path d="M4 3v2M7 3v3M10 3v2" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
            </svg>
            <p className="text-[15px] text-ink font-medium tracking-wider">
              收支折线图
            </p>
            <span className="text-[12px] text-ink-faint ml-auto">近半年</span>
          </div>
          <TrendChart data={trendData} />
        </div>

        <MonthPicker
          year={year}
          month={month}
          onChange={(y, m) => {
            setYear(y);
            setMonth(m);
          }}
        />

        {/* ── Expense Pie ── */}
        <div className="mt-4 sketch-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-expense">
              <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.2" />
              <path d="M5 7h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            <p className="text-[15px] text-ink font-medium tracking-wider">
              支出分布
            </p>
          </div>
          <CategoryChart data={expenseByCategory} />
          {expenseByCategory.length > 0 && (
            <>
              <div className="sketch-divider my-4" />
              <CategoryRanking data={expenseByCategory} total={expenseTotal} />
            </>
          )}
        </div>

        {/* ── Income Pie ── */}
        <div className="mt-4 sketch-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-income">
              <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.2" />
              <path d="M7 5v4M5 7h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            <p className="text-[15px] text-ink font-medium tracking-wider">
              收入分布
            </p>
          </div>
          <CategoryChart data={incomeByCategory} />
          {incomeByCategory.length > 0 && (
            <>
              <div className="sketch-divider my-4" />
              <CategoryRanking data={incomeByCategory} total={incomeTotal} />
            </>
          )}
        </div>

        <div className="h-4 safe-bottom" />
      </div>
    </div>
  );
}
