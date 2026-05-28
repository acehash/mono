"use client";

interface AmountKeyboardProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  saving?: boolean;
}

const rows = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
  ["0", "."],
];

export default function AmountKeyboard({
  value,
  onChange,
  onSubmit,
  saving,
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
    if (value.includes(".")) {
      const decimals = value.split(".")[1];
      if (decimals && decimals.length >= 2) return;
    }
    let next = value + key;
    if (next.length > 1 && next.startsWith("0") && !next.startsWith("0.")) {
      next = next.replace(/^0+/, "");
    }
    onChange(next);
  };

  return (
    <div className="grid gap-2 p-2" style={{ gridTemplateColumns: "repeat(4, 1fr)", gridAutoRows: "44px" }}>
      {/* Number keys */}
      {rows.map((row, ri) =>
        row.map((key) => (
          <button
            key={key}
            onClick={() => handlePress(key)}
            className={`sketch-button text-base font-medium text-ink bg-paper-warm active:bg-paper-line ${
              key === "0" && ri === 3 ? "col-span-2" : ""
            }`}
          >
            {key}
          </button>
        ))
      )}

      {/* Delete button — row 1, column 4 */}
      <button
        onClick={() => onChange(value.slice(0, -1))}
        className="sketch-button text-base font-medium text-ink bg-paper-warm active:bg-paper-line"
        style={{ gridRow: "1", gridColumn: "4" }}
      >
        ⌫
      </button>

      {/* Confirm button — rows 2-4, column 4 */}
      <button
        onClick={onSubmit}
        className="rounded-[3px_5px_2px_4px] text-paper-highlight text-body font-semibold transition-all active:translate-y-px disabled:opacity-40"
        style={{
          background: "var(--ink)",
          boxShadow: "2px 3px 0px rgba(44,36,22,0.25)",
          gridRow: "2 / 5",
          gridColumn: "4",
        }}
        disabled={!value || parseFloat(value) <= 0 || saving}
      >
        {saving ? "..." : "确定"}
      </button>
    </div>
  );
}
