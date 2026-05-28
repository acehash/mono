"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface CategoryChartProps {
  data: { name: string; value: number; color: string }[];
}

/* Muted, ink-wash palette for charts — pairs with paper background */
const INK_PALETTE = [
  "#A93226", // deep red
  "#1A5276", // blue-black
  "#7D6608", // ochre
  "#1E8449", // forest green
  "#6C3483", // plum
  "#BA4A00", // burnt orange
  "#2E4053", // charcoal blue
  "#117A65", // teal
  "#922B21", // dark red
  "#1F618D", // steel blue
];

function getInkColor(index: number): string {
  return INK_PALETTE[index % INK_PALETTE.length];
}

export default function CategoryChart({ data }: CategoryChartProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0);

  if (total === 0) {
    return (
      <div className="h-40 flex flex-col items-center justify-center">
        <svg
          width="48"
          height="48"
          viewBox="0 0 48 48"
          fill="none"
          className="mb-2 text-ink-faint opacity-30"
        >
          <circle
            cx="24"
            cy="24"
            r="18"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
          <path
            d="M24 6v36M6 24h36"
            stroke="currentColor"
            strokeWidth="0.8"
            opacity="0.4"
          />
        </svg>
        <p className="text-ink-faint text-caption">暂无数据</p>
      </div>
    );
  }

  /* Assign ink-wash colors to data */
  const coloredData = data.map((d, i) => ({
    ...d,
    color: d.color || getInkColor(i),
  }));

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-48 h-48 relative">
        {/* Hand-drawn circle decoration around chart */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 200 200"
          fill="none"
        >
          <circle
            cx="100"
            cy="100"
            r="92"
            stroke="#B8A88A"
            strokeWidth="1"
            strokeDasharray="3 5"
            opacity="0.4"
            filter="url(#sketchy)"
          />
        </svg>

        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={coloredData}
              cx="50%"
              cy="50%"
              innerRadius={38}
              outerRadius={75}
              paddingAngle={3}
              dataKey="value"
              strokeWidth={1.5}
              stroke="#F5F0E8"
            >
              {coloredData.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => `¥${Number(value).toFixed(2)}`}
              contentStyle={{
                background: "#FDF8F0",
                borderRadius: "2px 5px 3px 4px",
                border: "1.5px solid #B8A88A",
                boxShadow: "2px 3px 0px rgba(44,36,22,0.10)",
                fontFamily: "Inter Variable, SF Pro Text, -apple-system, sans-serif",
                fontSize: "12px",
                color: "#2C2416",
                padding: "8px 12px",
              }}
              itemStyle={{
                color: "#2C2416",
                fontFamily: "Inter Variable, SF Pro Text, -apple-system, sans-serif",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend — as notebook annotations */}
      <div className="w-full space-y-2">
        {coloredData.map((item, i) => (
          <div
            key={item.name}
            className="flex items-center gap-2.5 text-caption stagger-item"
          >
            {/* Ink swatch — small square with sketch feel */}
            <div
              className="w-3 h-3 flex-shrink-0"
              style={{
                backgroundColor: item.color,
                borderRadius: "1px 2px 1px 2px",
                filter: "url(#sketchy)",
              }}
            />
            <span className="flex-1 truncate text-ink-light">
              {item.name}
            </span>
            <span className="text-ink-faint num">
              {((item.value / total) * 100).toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
