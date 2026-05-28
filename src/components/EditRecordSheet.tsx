"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "@/lib/constants";
import type { TransactionType, Transaction } from "@/lib/types";
import AmountKeyboard from "./AmountKeyboard";
import CategoryGrid from "./CategoryGrid";
import DateTimePicker from "./DateTimePicker";
import ConfirmDialog from "./ConfirmDialog";

interface EditRecordSheetProps {
  record: Transaction | null;
  onClose: () => void;
  onSaved?: () => void;
  onDeleted?: () => void;
}

export default function EditRecordSheet({
  record,
  onClose,
  onSaved,
  onDeleted,
}: EditRecordSheetProps) {
  const [type, setType] = useState<TransactionType>("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [date, setDate] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<"save" | "delete" | null>(null);

  const categories = type === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  // Pre-fill form when record changes
  useEffect(() => {
    if (!record) return;
    setType(record.type);
    setAmount(String(record.amount));
    setCategory(record.category);
    setNote(record.note || "");
    const created = new Date(record.created_at);
    const h = String(created.getHours()).padStart(2, "0");
    const min = String(created.getMinutes()).padStart(2, "0");
    setDate(`${record.date}T${h}:${min}`);
  }, [record]);

  // Reset category when type changes
  useEffect(() => {
    if (!record) return;
    if (type !== record.type) {
      setCategory(null);
    }
  }, [type, record]);

  const handleSave = () => {
    if (!record || !category || !amount) return;
    setConfirmAction("save");
  };

  const handleDelete = () => {
    if (!record) return;
    setConfirmAction("delete");
  };

  const executeConfirm = async () => {
    if (!record) return;

    if (confirmAction === "save") {
      setSaving(true);
      setError(null);
      const { error } = await supabase
        .from("transactions")
        .update({
          type,
          amount: parseFloat(amount),
          category,
          note: note || null,
          date: date.split("T")[0],
        })
        .eq("id", record.id);
      setSaving(false);
      if (error) {
        setError(error.message);
      } else {
        onSaved?.();
        onClose();
      }
    } else if (confirmAction === "delete") {
      setDeleting(true);
      const { error } = await supabase
        .from("transactions")
        .delete()
        .eq("id", record.id);
      setDeleting(false);
      if (!error) {
        onDeleted?.();
        onClose();
      }
    }
    setConfirmAction(null);
  };

  if (!record) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-ink/30 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        className="absolute bottom-0 left-0 right-0 bg-paper-highlight max-h-[85vh] overflow-y-auto border-t-2 border-paper-line"
        style={{
          borderRadius: "6px 8px 0 0",
          filter: "url(#sketchy)",
        }}
      >
        {/* Drag handle */}
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

        {/* Header with delete button */}
        <div className="flex items-center justify-between px-4 mb-2">
          <span className="text-body text-ink font-medium">编辑记录</span>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="text-caption text-expense font-medium px-3 py-1.5 sketch-pill bg-expense/10 border-expense/30"
          >
            {deleting ? "删除中..." : "删除"}
          </button>
        </div>

        {/* Type toggle */}
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
          {error && (
            <p className="text-[12px] text-expense mt-1">{error}</p>
          )}
        </div>

        {/* Category grid */}
        <CategoryGrid
          categories={categories}
          selected={category}
          onSelect={setCategory}
        />

        {/* Date + Time + Note */}
        <div className="px-4 mb-2">
          <DateTimePicker
            value={date}
            onChange={setDate}
            note={note}
            onNoteChange={setNote}
          />
        </div>

        {/* Amount keyboard */}
        <AmountKeyboard
          value={amount}
          onChange={setAmount}
          onSubmit={handleSave}
          saving={saving}
        />
      </div>

      <ConfirmDialog
        open={confirmAction !== null}
        title={confirmAction === "delete" ? "删除记录" : "保存修改"}
        message={confirmAction === "delete" ? "确定删除这条记录吗？删除后无法恢复。" : "确定保存修改吗？"}
        confirmText={confirmAction === "delete" ? "删除" : "保存"}
        danger={confirmAction === "delete"}
        onConfirm={executeConfirm}
        onCancel={() => setConfirmAction(null)}
      />
    </div>
  );
}
