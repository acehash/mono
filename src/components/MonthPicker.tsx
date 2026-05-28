"use client";

interface Props {
  year: number;
  month: number;
  onChange: (year: number, month: number) => void;
}

export default function MonthPicker({ year, month, onChange }: Props) {
  const prev = () => {
    if (month === 1) onChange(year - 1, 12);
    else onChange(year, month - 1);
  };
  const next = () => {
    if (month === 12) onChange(year + 1, 1);
    else onChange(year, month + 1);
  };

  return (
    <div className="flex items-center justify-center gap-8 py-4">
      <button
        onClick={prev}
        className="p-2 text-ink-faint hover:text-ink transition-colors"
      >
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M11 4L6 9l5 5" />
        </svg>
      </button>

      <span className="text-title num text-ink w-32 text-center">
        {year}年{month.toString().padStart(2, "0")}月
      </span>

      <button
        onClick={next}
        className="p-2 text-ink-faint hover:text-ink transition-colors"
      >
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M7 4l5 5-5 5" />
        </svg>
      </button>
    </div>
  );
}
