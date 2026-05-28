"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { getCategoriesByType } from "@/lib/categories";
import type { Category, TransactionType } from "@/lib/types";
import AmountKeyboard from "./AmountKeyboard";
import CategoryGrid from "./CategoryGrid";
import DateTimePicker from "./DateTimePicker";

function formatLocalDateTime(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const h = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${y}-${m}-${day}T${h}:${min}`;
}

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
  const [date, setDate] = useState(() => formatLocalDateTime(new Date()));
  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setDate(formatLocalDateTime(new Date()));
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
      onSaved?.();
      onClose();
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop — warm overlay */}
      <div
        className="absolute inset-0 bg-ink/30 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="absolute bottom-0 left-0 right-0 bg-paper-highlight max-h-[85vh] overflow-y-auto border-t-2 border-paper-line"
        style={{
          borderRadius: "6px 8px 0 0",
          filter: "url(#sketchy)",
        }}
      >
        {/* Drag handle — pencil dash */}
        <div className="flex justify-center pt-2 pb-1">
          <svg width="40" height="6" viewBox="0 0 40 6" fill="none">
            <path
              d="M4 3 Q20 1 36 3"
              stroke="#B8A88A"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Type toggle — ledger columns */}
        <div className="flex gap-2 px-4 mb-2">
          <button
            onClick={() => setType("expense")}
            className={`flex-1 py-2.5 text-body font-medium transition-all duration-150 sketch-pill ${
              type === "expense"
                ? "bg-ink text-paper-highlight border-ink"
                : "bg-paper-warm text-ink-light"
            }`}
          >
            支出
          </button>
          <button
            onClick={() => setType("income")}
            className={`flex-1 py-2.5 text-body font-medium transition-all duration-150 sketch-pill ${
              type === "income"
                ? "bg-ink text-paper-highlight border-ink"
                : "bg-paper-warm text-ink-light"
            }`}
          >
            收入
          </button>
        </div>

        {/* Amount display */}
        <div className="text-center px-4 mb-2">
          <span className="num text-[2.5rem] leading-tight font-bold text-ink">
            ¥{amount || "0.00"}
          </span>
        </div>

        {/* Category grid */}
        <CategoryGrid
          categories={categories}
          selected={categoryId}
          onSelect={setCategoryId}
        />

        {/* Date + Time + Note */}
        <div className="px-4 mb-2">
          <DateTimePicker value={date} onChange={setDate} note={note} onNoteChange={setNote} />
        </div>

        {/* Amount keyboard */}
        <AmountKeyboard
          value={amount}
          onChange={setAmount}
          onSubmit={handleSave}
          saving={saving}
        />
      </div>
    </div>
  );
}
