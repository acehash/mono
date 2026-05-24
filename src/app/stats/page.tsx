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
  const [chartTab, setChartTab] = useState<"expense" | "income">("expense");
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

    // 本月数据
    const firstDay = new Date(year, month - 1, 1)
      .toISOString()
      .split("T")[0];
    const lastDay = new Date(year, month, 0)
      .toISOString()
      .split("T")[0];

    const { data: monthRecords } = await supabase
      .from("transactions")
      .select("*, categories(*)")
      .eq("user_id", user.id)
      .gte("date", firstDay)
      .lte("date", lastDay);

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

    // 最近6个月趋势
    const trend: { month: string; income: number; expense: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(year, month - 1 - i, 1);
      const mFirst = new Date(d.getFullYear(), d.getMonth(), 1)
        .toISOString()
        .split("T")[0];
      const mLast = new Date(d.getFullYear(), d.getMonth() + 1, 0)
        .toISOString()
        .split("T")[0];

      const { data: mRecords } = await supabase
        .from("transactions")
        .select("type, amount")
        .eq("user_id", user.id)
        .gte("date", mFirst)
        .lte("date", mLast);

      const inc =
        mRecords
          ?.filter((r) => r.type === "income")
          .reduce((s, r) => s + Number(r.amount), 0) || 0;
      const exp =
        mRecords
          ?.filter((r) => r.type === "expense")
          .reduce((s, r) => s + Number(r.amount), 0) || 0;

      trend.push({
        month: `${d.getMonth() + 1}月`,
        income: inc,
        expense: exp,
      });
    }
    setTrendData(trend);
  }, [year, month]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const currentData =
    chartTab === "expense" ? expenseByCategory : incomeByCategory;
  const currentTotal = currentData.reduce((sum, d) => sum + d.value, 0);

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

      {/* 图表 Tab 切换 */}
      <div className="flex gap-2 px-4 mb-2">
        <button
          onClick={() => setChartTab("expense")}
          className={`text-sm px-3 py-1 rounded-full transition ${
            chartTab === "expense"
              ? "bg-expense text-white"
              : "bg-gray-100 dark:bg-gray-800"
          }`}
        >
          支出
        </button>
        <button
          onClick={() => setChartTab("income")}
          className={`text-sm px-3 py-1 rounded-full transition ${
            chartTab === "income"
              ? "bg-income text-white"
              : "bg-gray-100 dark:bg-gray-800"
          }`}
        >
          收入
        </button>
      </div>

      <HandDrawnPieChart
        data={currentData}
        title={chartTab === "expense" ? "支出分类" : "收入分类"}
      />
      <CategoryRanking data={currentData} total={currentTotal} />

      <TrendChart data={trendData} />
    </div>
  );
}
