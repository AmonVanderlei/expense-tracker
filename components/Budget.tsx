"use client";
import { formatCurrency } from "@/utils/formatCurrency";
import clsx from "clsx";

interface Props {
  budget: number;
  expenses: number;
}

export default function Budget({ budget, expenses }: Props) {
  return (
    <div className={clsx("w-11/12", budget == 0 && "hidden")}>
      <div className="flex justify-between items-center">
        <h2 className="text-lg text-blue-500 font-bold">Monthly Budget</h2>
        <p className="text-lg text-blue-700 font-black">
          {formatCurrency(budget)}
        </p>
      </div>
      <div className="h-2 bg-gray-900 rounded-full overflow-hidden">
        <div
          className="h-2 bg-blue-200 w-0 transition-all"
          style={{ width: `${Math.max((100 * expenses) / budget, 0)}%` }}
        ></div>
      </div>
      <div className="flex justify-between text-sm">
        <p className="text-blue-500">
          Spent: {formatCurrency(expenses)}/
          {Math.round((100 * expenses) / budget) || 0}%
        </p>
        <p className="text-blue-300">
          Left: {formatCurrency(budget - expenses)}/
          {100 - Math.round((100 * expenses) / budget) || 100}%
        </p>
      </div>
    </div>
  );
}
