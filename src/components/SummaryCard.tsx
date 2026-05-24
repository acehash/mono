"use client";

interface SummaryCardProps {
  income: number;
  expense: number;
}

export default function SummaryCard({ income, expense }: SummaryCardProps) {
  const balance = income - expense;

  return (
    <div className="card-handdrawn p-5 mx-4 mt-4">
      <h2 className="font-hand text-lg text-gray-500 mb-3">本月概览</h2>
      <div className="flex justify-between">
        <div className="text-center">
          <p className="text-xs text-gray-400">收入</p>
          <p className="text-xl font-hand font-bold text-income">
            ¥{income.toFixed(2)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-400">支出</p>
          <p className="text-xl font-hand font-bold text-expense">
            ¥{expense.toFixed(2)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-400">结余</p>
          <p
            className={`text-xl font-hand font-bold ${
              balance >= 0 ? "text-income" : "text-expense"
            }`}
          >
            ¥{balance.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}
