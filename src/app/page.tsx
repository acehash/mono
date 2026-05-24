"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import SummaryCard from "@/components/SummaryCard";
import HandDrawnPieChart from "@/components/HandDrawnPieChart";
import AddRecordSheet from "@/components/AddRecordSheet";
import type { TransactionWithCategory } from "@/lib/types";

const EXPENSE_COLORS = [
  "#FF6B4A", "#FF9B85", "#FFB4A2", "#FFC8BB",
  "#FFDDD2", "#E8DDD0", "#D4C8B8", "#C0B4A4",
];
const INCOME_COLORS = [
  "#4ADE80", "#7DD3A8", "#A8E6C3", "#C3F0D7",
  "#D8F5E4", "#E8FAED", "#B8E8C8", "#90D8A8",
];

export default function HomePage() {
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [expenseByCategory, setExpenseByCategory] = useState<
    { name: string; value: number; color: string }[]
  >([]);
  const [incomeByCategory, setIncomeByCategory] = useState<
    { name: string; value: number; color: string }[]
  >([]);
  const [recentRecords, setRecentRecords] = useState<TransactionWithCategory[]>(
    []
  );
  const [sheetOpen, setSheetOpen] = useState(false);
  const [chartTab, setChartTab] = useState<"expense" | "income">("expense");

  const loadData = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
      .toISOString()
      .split("T")[0];
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)
      .toISOString()
      .split("T")[0];

    // 获取本月记录
    const { data: records } = await supabase
      .from("transactions")
      .select("*, categories(*)")
      .eq("user_id", user.id)
      .gte("date", firstDay)
      .lte("date", lastDay)
      .order("date", { ascending: false });

    if (!records) return;

    // 计算收支
    const inc = records
      .filter((r) => r.type === "income")
      .reduce((sum, r) => sum + Number(r.amount), 0);
    const exp = records
      .filter((r) => r.type === "expense")
      .reduce((sum, r) => sum + Number(r.amount), 0);
    setIncome(inc);
    setExpense(exp);

    // 按分类汇总
    const groupByCategory = (
      type: "income" | "expense",
      colors: string[]
    ) => {
      const filtered = records.filter((r) => r.type === type);
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

    // 最近记录
    setRecentRecords(records.slice(0, 5) as TransactionWithCategory[]);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <div className="pt-4 pb-4">
      <div className="px-4 mb-2">
        <h1 className="font-hand text-3xl font-bold">Mono</h1>
      </div>

      <SummaryCard income={income} expense={expense} />

      {/* 图表 Tab 切换 */}
      <div className="flex gap-2 px-4 mt-4">
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
        data={chartTab === "expense" ? expenseByCategory : incomeByCategory}
        title={chartTab === "expense" ? "支出分类" : "收入分类"}
      />

      {/* 最近记录 */}
      <div className="px-4 mt-4">
        <h3 className="font-hand text-lg text-gray-500 mb-2">最近记录</h3>
        {recentRecords.length === 0 ? (
          <div className="text-center text-gray-400 py-8 text-sm">
            还没有记录，点击 + 开始记账
          </div>
        ) : (
          <div className="space-y-2">
            {recentRecords.map((r) => (
              <div
                key={r.id}
                className="card-handdrawn flex items-center justify-between p-3"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">
                    {r.categories?.name || "未分类"}
                  </span>
                  <span className="text-sm text-gray-400">
                    {r.note || r.date}
                  </span>
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
        )}
      </div>

      {/* 浮动添加按钮 */}
      <button
        onClick={() => setSheetOpen(true)}
        className="fixed bottom-20 right-4 w-14 h-14 rounded-full bg-expense text-white text-3xl shadow-lg active:scale-95 transition z-40"
      >
        +
      </button>

      <AddRecordSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onSaved={loadData}
      />
    </div>
  );
}
