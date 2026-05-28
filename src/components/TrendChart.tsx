"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface TrendChartProps {
  data: { month: string; income: number; expense: number }[];
}

export default function TrendChart({ data }: TrendChartProps) {
  if (data.length === 0) {
    return (
      <div className="h-40 flex flex-col items-center justify-center">
        <svg
          width="48"
          height="32"
          viewBox="0 0 48 32"
          fill="none"
          className="mb-2 text-ink-faint opacity-30"
        >
          <path
            d="M4 28 L16 12 L28 20 L44 4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="4 3"
          />
          <circle cx="16" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="28" cy="20" r="2.5" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="44" cy="4" r="2.5" stroke="currentColor" strokeWidth="1.2" />
        </svg>
        <p className="text-ink-faint text-caption">暂无数据</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data}>
        <CartesianGrid
          strokeDasharray="3 6"
          stroke="#D8D0C0"
          vertical={false}
          opacity={0.5}
        />
        <XAxis
          dataKey="month"
          tick={{
            fontSize: 11,
            fill: "#A89880",
            fontFamily: "Inter Variable, SF Pro Text, -apple-system, sans-serif",
          }}
          axisLine={{ stroke: "#D8D0C0", strokeWidth: 1 }}
          tickLine={false}
        />
        <YAxis
          tick={{
            fontSize: 11,
            fill: "#A89880",
            fontFamily: "Inter Variable, SF Pro Text, -apple-system, sans-serif",
          }}
          axisLine={false}
          tickLine={false}
          width={48}
          tickFormatter={(v) =>
            v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v
          }
        />
        <Tooltip
          formatter={(value, name) => [
            `¥${Number(value).toFixed(2)}`,
            name === "income" ? "收入" : "支出",
          ]}
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
        <Line
          type="monotone"
          dataKey="income"
          stroke="#1E8449"
          strokeWidth={2}
          dot={{
            r: 3.5,
            fill: "#1E8449",
            stroke: "#F5F0E8",
            strokeWidth: 2,
          }}
          activeDot={{
            r: 5,
            fill: "#1E8449",
            stroke: "#F5F0E8",
            strokeWidth: 2,
          }}
          name="收入"
        />
        <Line
          type="monotone"
          dataKey="expense"
          stroke="#A93226"
          strokeWidth={2}
          dot={{
            r: 3.5,
            fill: "#A93226",
            stroke: "#F5F0E8",
            strokeWidth: 2,
          }}
          activeDot={{
            r: 5,
            fill: "#A93226",
            stroke: "#F5F0E8",
            strokeWidth: 2,
          }}
          name="支出"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
