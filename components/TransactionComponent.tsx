"use client";
import Transaction from "@/types/Transaction";
import { formatCurrency } from "@/utils/formatCurrency";
import clsx from "clsx";

interface Props {
  obj: Transaction;
}

export default function Transactions({ obj }: Props) {
  return (
    <div className="flex flex-col items-center w-full gap-2">
      <div className="flex justify-between items-center w-full">
        <div>
          <h1 className="text-lg font-semibold">
            {obj.type == "income" ? obj.origin : obj.destiny}
          </h1>
          <p className="text-sm">{obj.date.toDateString()}</p>
        </div>
        <p>{obj.category}</p>
        <p
          className={clsx(
            obj.type == "income" && "text-green-500",
            obj.type == "expense" && "text-red-500"
          )}
        >
          {formatCurrency(obj.amount)}
        </p>
      </div>
    </div>
  );
}
