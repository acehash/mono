"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import MonthPicker from "@/components/MonthPicker";
import RecordList from "@/components/RecordList";
import type { TransactionWithCategory } from "@/lib/types";

export default function RecordsPage() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [records, setRecords] = useState<TransactionWithCategory[]>([]);
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">(
    "all"
  );

  const loadRecords = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const firstDay = new Date(year, month - 1, 1)
      .toISOString()
      .split("T")[0];
    const lastDay = new Date(year, month, 0)
      .toISOString()
      .split("T")[0];

    let query = supabase
      .from("transactions")
      .select("*, categories(*)")
      .eq("user_id", user.id)
      .gte("date", firstDay)
      .lte("date", lastDay)
      .order("date", { ascending: false });

    if (filterType !== "all") {
      query = query.eq("type", filterType);
    }

    const { data } = await query;
    setRecords((data || []) as TransactionWithCategory[]);
  }, [year, month, filterType]);

  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  const handleDelete = async (id: string) => {
    if (!confirm("确定删除这条记录吗？")) return;
    await supabase.from("transactions").delete().eq("id", id);
    loadRecords();
  };

  return (
    <div className="pt-4">
      <div className="px-4 mb-2">
        <h1 className="font-hand text-3xl font-bold">流水</h1>
      </div>

      <MonthPicker
        year={year}
        month={month}
        onChange={(y, m) => {
          setYear(y);
          setMonth(m);
        }}
      />

      {/* 筛选 */}
      <div className="flex gap-2 px-4 mb-4">
        {(["all", "expense", "income"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setFilterType(t)}
            className={`text-sm px-3 py-1 rounded-full transition ${
              filterType === t
                ? t === "expense"
                  ? "bg-expense text-white"
                  : t === "income"
                  ? "bg-income text-white"
                  : "bg-gray-800 text-white dark:bg-gray-200 dark:text-gray-800"
                : "bg-gray-100 dark:bg-gray-800"
            }`}
          >
            {t === "all" ? "全部" : t === "expense" ? "支出" : "收入"}
          </button>
        ))}
      </div>

      <RecordList records={records} onDelete={handleDelete} />
    </div>
  );
}
