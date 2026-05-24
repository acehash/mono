"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface HandDrawnPieChartProps {
  data: { name: string; value: number; color: string }[];
  title: string;
}

export default function HandDrawnPieChart({
  data,
  title,
}: HandDrawnPieChartProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="card-handdrawn p-4 mx-4 mt-4">
      <h3 className="font-hand text-lg text-gray-500 mb-2">{title}</h3>
      {total === 0 ? (
        <div className="h-40 flex items-center justify-center text-gray-400 text-sm">
          暂无数据
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <div className="w-32 h-32">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={55}
                  paddingAngle={2}
                  dataKey="value"
                  strokeWidth={2}
                  stroke="#FFF8F0"
                >
                  {data.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => `¥${Number(value).toFixed(2)}`}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex-1 space-y-1.5">
            {data.slice(0, 5).map((item) => (
              <div key={item.name} className="flex items-center gap-2 text-sm">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="flex-1 truncate">{item.name}</span>
                <span className="text-gray-500">
                  {((item.value / total) * 100).toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
