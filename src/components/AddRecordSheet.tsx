"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { getCategoriesByType } from "@/lib/categories";
import type { Category, TransactionType } from "@/lib/types";
import AmountKeyboard from "./AmountKeyboard";
import CategoryGrid from "./CategoryGrid";

interface AddRecordSheetProps {
  open: boolean;
  onClose: () => void;
  onSaved?: () => void;
}

export default function AddRecordSheet({
  open,
  onClose,
  onSaved,
}: AddRecordSheetProps) {
  const [type, setType] = useState<TransactionType>("expense");
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 16));
  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    const loadCategories = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const cats = await getCategoriesByType(user.id, type);
      setCategories(cats);
      setCategoryId(null);
    };
    loadCategories();
  }, [open, type]);

  const handleSave = async () => {
    if (!categoryId || !amount) return;
    setSaving(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from("transactions").insert({
      user_id: user.id,
      type,
      amount: parseFloat(amount),
      category_id: categoryId,
      note: note || null,
      date: date.split("T")[0],
    });

    setSaving(false);
    if (!error) {
      setAmount("");
      setCategoryId(null);
      setNote("");
      setDate(new Date().toISOString().slice(0, 16));
      onSaved?.();
      onClose();
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* 背景遮罩 */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* 弹窗内容 */}
      <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-900 rounded-t-3xl max-h-[85vh] overflow-y-auto">
        {/* 拖拽条 */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-gray-300" />
        </div>

        {/* 类型切换 */}
        <div className="flex gap-2 px-4 mb-4">
          <button
            onClick={() => setType("expense")}
            className={`flex-1 py-2 rounded-xl font-medium transition ${
              type === "expense"
                ? "bg-expense text-white"
                : "bg-gray-100 dark:bg-gray-800"
            }`}
          >
            支出
          </button>
          <button
            onClick={() => setType("income")}
            className={`flex-1 py-2 rounded-xl font-medium transition ${
              type === "income"
                ? "bg-income text-white"
                : "bg-gray-100 dark:bg-gray-800"
            }`}
          >
            收入
          </button>
        </div>

        {/* 金额显示 */}
        <div className="text-center px-4 mb-4">
          <span className="text-4xl font-hand font-bold">
            ¥{amount || "0.00"}
          </span>
        </div>

        {/* 分类选择 */}
        <CategoryGrid
          categories={categories}
          selected={categoryId}
          onSelect={setCategoryId}
        />

        {/* 日期 + 备注 */}
        <div className="flex gap-3 px-4 mb-3">
          <input
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="flex-1 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-sm"
          />
          <input
            type="text"
            placeholder="备注..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="flex-1 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-sm"
          />
        </div>

        {/* 金额键盘 */}
        <AmountKeyboard
          value={amount}
          onChange={setAmount}
          onSubmit={handleSave}
        />
      </div>
    </div>
  );
}
