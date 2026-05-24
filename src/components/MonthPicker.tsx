"use client";

interface MonthPickerProps {
  year: number;
  month: number;
  onChange: (year: number, month: number) => void;
}

export default function MonthPicker({
  year,
  month,
  onChange,
}: MonthPickerProps) {
  const handlePrev = () => {
    if (month === 1) {
      onChange(year - 1, 12);
    } else {
      onChange(year, month - 1);
    }
  };

  const handleNext = () => {
    if (month === 12) {
      onChange(year + 1, 1);
    } else {
      onChange(year, month + 1);
    }
  };

  return (
    <div className="flex items-center justify-center gap-6 py-3">
      <button
        onClick={handlePrev}
        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
      >
        ←
      </button>
      <span className="font-hand text-xl font-bold">
        {year}年{month}月
      </span>
      <button
        onClick={handleNext}
        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
      >
        →
      </button>
    </div>
  );
}
