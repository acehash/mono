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
  return (
    <div className="card-handdrawn p-4 mx-4 mt-4">
      <h3 className="font-hand text-lg text-gray-500 mb-2">收支趋势</h3>
      {data.length === 0 ? (
        <div className="h-40 flex items-center justify-center text-gray-400 text-sm">
          暂无数据
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#E8DDD0"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12, fill: "#999" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "#999" }}
              axisLine={false}
              tickLine={false}
              width={50}
            />
            <Tooltip
              formatter={(value) => `¥${Number(value).toFixed(2)}`}
              contentStyle={{
                borderRadius: "12px",
                border: "1.5px solid #E8DDD0",
              }}
            />
            <Line
              type="monotone"
              dataKey="income"
              stroke="#4ADE80"
              strokeWidth={2.5}
              dot={{ r: 4, fill: "#4ADE80" }}
              name="收入"
            />
            <Line
              type="monotone"
              dataKey="expense"
              stroke="#FF6B4A"
              strokeWidth={2.5}
              dot={{ r: 4, fill: "#FF6B4A" }}
              name="支出"
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
