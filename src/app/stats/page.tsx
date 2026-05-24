"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import MonthPicker from "@/components/MonthPicker";
import HandDrawnPieChart from "@/components/HandDrawnPieChart";
import CategoryRanking from "@/components/CategoryRanking";
import TrendChart from "@/components/TrendChart";

const EXPENSE_COLORS = [
  "#FF6B4A", "#FF9B85", "#FFB4A2", "#FFC8BB",
  "#FFDDD2", "#E8DDD0", "#D4C8B8", "#C0B4A4",
];
const INCOME_COLORS = [
  "#4ADE80", "#7DD3A8", "#A8E6C3", "#C3F0D7",
  "#D8F5E4", "#E8FAED", "#B8E8C8", "#90D8A8",
];

export default function StatsPage() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [expenseByCategory, setExpenseByCategory] = useState<
    { name: string; value: number; color: string }[]
  >([]);
  const [incomeByCategory, setIncomeByCategory] = useState<
    { name: string; value: number; color: string }[]
  >([]);
  const [trendData, setTrendData] = useState<
    { month: string; income: number; expense: number }[]
  >([]);

  const loadData = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    // 本月数据 + 6个月趋势数据并行查询
    const firstDay = new Date(year, month - 1, 1)
      .toISOString()
      .split("T")[0];
    const lastDay = new Date(year, month, 0)
      .toISOString()
      .split("T")[0];

    const earliestMonth = new Date(year, month - 1 - 5, 1);
    const rangeStart = earliestMonth.toISOString().split("T")[0];

    const [{ data: monthRecords }, { data: trendRecords }] = await Promise.all([
      supabase
        .from("transactions")
        .select("*, categories(*)")
        .eq("user_id", user.id)
        .gte("date", firstDay)
        .lte("date", lastDay),
      supabase
        .from("transactions")
        .select("type, amount, date")
        .eq("user_id", user.id)
        .gte("date", rangeStart)
        .lte("date", lastDay),
    ]);

    if (monthRecords) {
      const groupByCategory = (
        type: "income" | "expense",
        colors: string[]
      ) => {
        const filtered = monthRecords.filter((r) => r.type === type);
        const map = new Map<string, number>();
        filtered.forEach((r) => {
          const name = r.categories?.name || "未分类";
          map.set(name, (map.get(name) || 0) + Number(r.amount));
        });
        return Array.from(map.entries())
          .sort((a, b) => b[1] - a[1])
          .map(([name, value], i) => ({
            name,
            value,
            color: colors[i % colors.length],
          }));
      };

      setExpenseByCategory(groupByCategory("expense", EXPENSE_COLORS));
      setIncomeByCategory(groupByCategory("income", INCOME_COLORS));
    }

    // 客户端按月分组
    const monthBuckets = new Map<string, { income: number; expense: number }>();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(year, month - 1 - i, 1);
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
      const d = new Date(year, month - 1 - i, 1);
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
    <div className="pt-4">
      <div className="px-4 mb-2">
        <h1 className="font-hand text-3xl font-bold">统计</h1>
      </div>

      <MonthPicker
        year={year}
        month={month}
        onChange={(y, m) => {
          setYear(y);
          setMonth(m);
        }}
      />

      <HandDrawnPieChart
        data={expenseByCategory}
        title="支出分类"
      />
      <CategoryRanking data={expenseByCategory} total={expenseTotal} />

      <HandDrawnPieChart
        data={incomeByCategory}
        title="收入分类"
      />
      <CategoryRanking data={incomeByCategory} total={incomeTotal} />

      <TrendChart data={trendData} />
    </div>
  );
}
