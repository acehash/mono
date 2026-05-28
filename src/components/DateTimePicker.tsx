"use client";

import { useState } from "react";
import ScrollPicker from "./ScrollPicker";

interface DateTimePickerProps {
  value: string;
  onChange: (value: string) => void;
  note?: string;
  onNoteChange?: (v: string) => void;
}

const MONTHS = Array.from({ length: 12 }, (_, i) =>
  String(i + 1).padStart(2, "0")
);
const HOURS = Array.from({ length: 24 }, (_, i) =>
  String(i).padStart(2, "0")
);
const MINUTES = Array.from({ length: 60 }, (_, i) =>
  String(i).padStart(2, "0")
);

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate();
}

function parseDate(val: string) {
  const [datePart, timePart] = val.split("T");
  const [y, m, d] = datePart.split("-").map(Number);
  const [h, min] = (timePart || "00:00").split(":").map(Number);
  return { year: y, month: m, day: d, hour: h, minute: min };
}

function formatLocalDateTime(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const h = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${y}-${m}-${day}T${h}:${min}`;
}

export default function DateTimePicker({
  value,
  onChange,
  note,
  onNoteChange,
}: DateTimePickerProps) {
  const [open, setOpen] = useState<"date" | "time" | null>(null);
  const [draft, setDraft] = useState(value);

  const parsed = parseDate(value);
  const draftParsed = parseDate(draft);

  const now = new Date();
  const days = Array.from(
    { length: getDaysInMonth(draftParsed.year, draftParsed.month) },
    (_, i) => String(i + 1).padStart(2, "0")
  );

  const openPicker = (mode: "date" | "time") => {
    const now = new Date();
    const parsed = parseDate(value);
    const dateStr = `${parsed.year}-${String(parsed.month).padStart(2, "0")}-${String(parsed.day).padStart(2, "0")}`;
    const timeStr = `${String(parsed.hour).padStart(2, "0")}:${String(parsed.minute).padStart(2, "0")}`;
    setDraft(`${dateStr}T${timeStr}`);
    setOpen(mode);
  };

  const handleConfirm = () => {
    onChange(draft);
    setOpen(null);
  };

  const updateDraft = (patch: Partial<typeof draftParsed>) => {
    const next = { ...draftParsed, ...patch };
    const maxDay = getDaysInMonth(next.year, next.month);
    if (next.day > maxDay) next.day = maxDay;
    const dateStr = `${next.year}-${String(next.month).padStart(2, "0")}-${String(next.day).padStart(2, "0")}`;
    const timeStr = `${String(next.hour).padStart(2, "0")}:${String(next.minute).padStart(2, "0")}`;
    setDraft(`${dateStr}T${timeStr}`);
  };

  const displayDate = `${parsed.month}月${parsed.day}日`;
  const displayTime = `${String(parsed.hour).padStart(2, "0")}:${String(parsed.minute).padStart(2, "0")}`;

  return (
    <>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => openPicker("date")}
          className="flex-1 flex items-center gap-2 px-3 py-2.5 bg-paper-highlight border border-solid rounded-[2px_4px_2px_3px] text-caption num text-ink"
          style={{ borderColor: "var(--sketch-border)" }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-ink-faint flex-shrink-0">
            <rect x="1.5" y="2.5" width="11" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
            <path d="M1.5 5.5h11" stroke="currentColor" strokeWidth="1.2" />
            <path d="M4.5 1v2M9.5 1v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
          <span>{displayDate}</span>
        </button>
        <button
          type="button"
          onClick={() => openPicker("time")}
          className="flex items-center gap-2 px-3 py-2.5 bg-paper-highlight border border-solid rounded-[2px_4px_2px_3px] text-caption num text-ink"
          style={{ borderColor: "var(--sketch-border)" }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-ink-faint flex-shrink-0">
            <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.2" />
            <path d="M7 4v3.5l2.5 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>{displayTime}</span>
        </button>
        {onNoteChange && (
          <input
            type="text"
            placeholder="备注..."
            value={note ?? ""}
            onChange={(e) => onNoteChange(e.target.value)}
            className="flex-1 min-w-0 sketch-input px-3 py-2.5 text-caption text-ink placeholder:text-ink-faint bg-paper-highlight"
          />
        )}
      </div>

      {open && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center">
          <div className="absolute inset-0 bg-ink/20 backdrop-blur-[1px]" onClick={() => setOpen(null)} />
          <div
            className="relative w-full max-w-lg bg-paper mx-4 mb-8 overflow-hidden animate-sketch-in"
            style={{ borderRadius: "12px" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-4 pb-3">
              <button type="button" onClick={() => setOpen(null)} className="text-caption text-ink-faint px-2 py-1">
                取消
              </button>
              <span className="text-body text-ink font-medium">
                {open === "date" ? "选择日期" : "选择时间"}
              </span>
              <button type="button" onClick={handleConfirm} className="text-caption text-accent font-medium px-2 py-1">
                确定
              </button>
            </div>

            {/* Picker columns */}
            <div className="flex items-center justify-center gap-2 px-4 pb-6">
              {open === "date" ? (
                <>
                  <ScrollPicker
                    items={MONTHS}
                    value={String(draftParsed.month).padStart(2, "0")}
                    onChange={(v) => updateDraft({ month: Number(v) })}
                    className="w-16"
                  />
                  <span className="text-ink-faint text-caption">-</span>
                  <ScrollPicker
                    items={days}
                    value={String(draftParsed.day).padStart(2, "0")}
                    onChange={(v) => updateDraft({ day: Number(v) })}
                    className="w-16"
                  />
                </>
              ) : (
                <>
                  <ScrollPicker
                    items={HOURS}
                    value={String(draftParsed.hour).padStart(2, "0")}
                    onChange={(v) => updateDraft({ hour: Number(v) })}
                    className="w-20"
                  />
                  <span className="text-ink-faint text-lg font-bold">:</span>
                  <ScrollPicker
                    items={MINUTES}
                    value={String(draftParsed.minute).padStart(2, "0")}
                    onChange={(v) => updateDraft({ minute: Number(v) })}
                    className="w-20"
                  />
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
