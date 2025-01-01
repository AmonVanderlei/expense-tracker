import Bill from "@/types/Bill";
import Category from "@/types/Category";
import Transaction from "@/types/Transaction";
import { formatCurrency } from "@/utils/formatCurrency";
import clsx from "clsx";
import { Dispatch, SetStateAction } from "react";

interface Props {
  obj: Transaction;
  categories: Category[];
  setSelectedObj: Dispatch<SetStateAction<Transaction | Bill | null>>;
  openModal: Dispatch<SetStateAction<boolean>>;
}

export default function Transactions({
  categories,
  obj,
  setSelectedObj,
  openModal,
}: Props) {
  const category = categories.find((cat) => cat.id === obj.categoryId);
  return (
    <div
      className="flex justify-between items-center w-full"
      onClick={() => {
        setSelectedObj(obj);
        openModal(true);
      }}
    >
      <div>
        <h1 className="text-lg font-semibold">{obj.destiny}</h1>
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
  );
}
