import { AuthContext } from "@/contexts/authContext";
import Bank from "@/types/Bank";
import Bill from "@/types/Bill";
import Category from "@/types/Category";
import Transaction from "@/types/Transaction";
import { formatCurrency } from "@/utils/formatCurrency";
import clsx from "clsx";
import { Dispatch, SetStateAction, useContext } from "react";

interface Props {
  obj: Transaction;
  banks: Bank[];
  categories: Category[];
  setSelectedObj: Dispatch<SetStateAction<Transaction | Bill | null>>;
  openModal: Dispatch<SetStateAction<boolean>>;
}

export default function Transactions({
  banks,
  categories,
  obj,
  setSelectedObj,
  openModal,
}: Props) {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("AuthContext must be used within a AuthContextProvider");
  }
  const { messages } = authContext;
  const category = categories.find((cat) => cat.id === obj.categoryId);
  const bank = banks?.find((b) => b.id === obj.bankId);
  return (
    <div
      style={{ borderBlockColor: bank?.color }}
      className="flex justify-between items-center w-full border-b-2 pb-2"
      onClick={() => {
        setSelectedObj(obj);
        openModal(true);
      }}
    >
      <div>
        <h1 className="text-lg font-semibold">{obj.destiny}</h1>
        <p className="text-sm">{obj.date.toDateString()}</p>
      </div>
      <p>{category ? category.name : messages.other.noCategory}</p>
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
