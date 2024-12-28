"use client";
import Category from "@/types/Category";
import Transaction from "@/types/Transaction";
import { formatCurrency } from "@/utils/formatCurrency";
import clsx from "clsx";

interface Props {
  obj: Transaction;
  categories: Category[];
}

export default function Transactions({ categories, obj }: Props) {
  const category = categories.find((cat) => cat.id === obj.categoryId);
  return (
    <div className="flex flex-col items-center w-full gap-2">
      <div className="flex justify-between items-center w-full">
        <div>
          <h1 className="text-lg font-semibold">
            {obj.type == "income" ? obj.origin : obj.destiny}
          </h1>
          <p className="text-sm">{obj.date.toDateString()}</p>
        </div>
        <p>{category ? category.name : "Sem Categoria"}</p>
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
