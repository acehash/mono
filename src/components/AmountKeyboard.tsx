"use client";

interface AmountKeyboardProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "⌫"];

export default function AmountKeyboard({
  value,
  onChange,
  onSubmit,
}: AmountKeyboardProps) {
  const handlePress = (key: string) => {
    if (key === "⌫") {
      onChange(value.slice(0, -1));
      return;
    }
    if (key === "." && value.includes(".")) return;
    if (key === "." && value === "") {
      onChange("0.");
      return;
    }
    // 限制小数点后两位
    if (value.includes(".")) {
      const decimals = value.split(".")[1];
      if (decimals && decimals.length >= 2) return;
    }
    onChange(value + key);
  };

  return (
    <div className="grid grid-cols-4 gap-2 p-2">
      {keys.map((key) => (
        <button
          key={key}
          onClick={() => handlePress(key)}
          className="h-14 rounded-xl text-xl font-medium bg-gray-100 dark:bg-gray-800 active:bg-gray-200 dark:active:bg-gray-700 transition"
        >
          {key}
        </button>
      ))}
      <button
        onClick={onSubmit}
        className="col-span-4 h-14 rounded-xl text-lg font-medium bg-expense text-white active:bg-expense-dark transition disabled:opacity-50"
        disabled={!value || parseFloat(value) <= 0}
      >
        记一笔
      </button>
    </div>
  );
}
