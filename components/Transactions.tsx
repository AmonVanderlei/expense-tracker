"use client";

import Transaction from "@/types/Transaction";
import TransactionComponent from "@/components/TransactionComponent";

interface Props {
  transactionsList: Transaction[] | null;
}

export default function Transactions({ transactionsList }: Props) {
  return (
    <div className="flex flex-col items-center w-full gap-2">
      {transactionsList?.map((transaction: Transaction) => (
        <TransactionComponent obj={transaction} key={transaction.id} />
      ))}
    </div>
  );
}
