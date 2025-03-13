import Transaction from "@/types/Transaction";
import TransactionComponent from "@/components/TransactionComponent";
import Category from "@/types/Category";
import { Dispatch, SetStateAction } from "react";
import Bill from "@/types/Bill";
import Bank from "@/types/Bank";

interface Props {
  transactionsList: Transaction[] | null;
  banks: Bank[];
  categories: Category[];
  setSelectedObj: Dispatch<SetStateAction<Transaction | Bill | null>>;
  openModal: Dispatch<SetStateAction<boolean>>;
}

export default function TransactionsComponent({
  banks,
  categories,
  transactionsList,
  setSelectedObj,
  openModal,
}: Props) {
  return (
    <div className="flex flex-col items-center w-full gap-4">
      {transactionsList?.map((transaction: Transaction) => (
        <TransactionComponent
          obj={transaction}
          key={transaction.id}
          banks={banks}
          categories={categories}
          setSelectedObj={setSelectedObj}
          openModal={openModal}
        />
      ))}
    </div>
  );
}
