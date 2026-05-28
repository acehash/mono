"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { getUserId } from "@/lib/user-id";
import MonthPicker from "@/components/MonthPicker";
import RecordList from "@/components/RecordList";
import EditRecordSheet from "@/components/EditRecordSheet";
import type { Transaction } from "@/lib/types";

export default function RecordsPage() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [records, setRecords] = useState<Transaction[]>([]);
  const [filter, setFilter] = useState<"all" | "expense" | "income">("all");
  const [editingRecord, setEditingRecord] = useState<Transaction | null>(null);

  const loadRecords = useCallback(async () => {
    const userId = getUserId();

    const firstDay = new Date(year, month - 1, 1)
      .toISOString()
      .split("T")[0];
    const lastDay = new Date(year, month, 0)
      .toISOString()
      .split("T")[0];

    let query = supabase
      .from("transactions")
      .select("*")
      .eq("user_id", userId)
      .gte("date", firstDay)
      .lte("date", lastDay)
      .order("date", { ascending: false })
      .order("created_at", { ascending: false });

    if (filter !== "all") {
      query = query.eq("type", filter);
    }

    const { data } = await query;
    setRecords((data || []) as Transaction[]);
  }, [year, month, filter]);

  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  const handleEdit = (id: string) => {
    const record = records.find((r) => r.id === id);
    if (record) setEditingRecord(record);
  };

  return (
    <div className="min-h-screen bg-paper">
      <div className="max-w-lg mx-auto">
        <MonthPicker
          year={year}
          month={month}
          onChange={(y, m) => {
            setYear(y);
            setMonth(m);
          }}
        />

        {/* Filter Pills */}
        <div className="flex justify-center gap-2 px-4 mb-4">
          {(["all", "expense", "income"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`sketch-pill px-4 py-1.5 text-caption font-medium transition-all duration-150 ${
                filter === f
                  ? "bg-ink text-paper-highlight border-ink"
                  : "bg-paper-highlight text-ink-light hover:text-ink"
              }`}
            >
              {f === "all" ? "全部" : f === "expense" ? "支出" : "收入"}
            </button>
          ))}
        </div>

        {/* Records */}
        <div className="px-4">
          <RecordList records={records} filter={filter} onEdit={handleEdit} />
        </div>

        <div className="h-4 safe-bottom" />
      </div>

      <EditRecordSheet
        record={editingRecord}
        onClose={() => setEditingRecord(null)}
        onSaved={loadRecords}
        onDeleted={loadRecords}
      />
    </div>
  );
}
