"use client";
import { formatCurrency } from "@/utils/formatCurrency";
import { useContext } from "react";
import clsx from "clsx";
import TransactionsComponent from "@/components/TransactionsComponent";
import BillsComponent from "@/components/BillsComponent";
import { DataContext } from "@/contexts/dataContext";

export default function Transactions() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("DataContext must be used within a DataContextProvider");
  }
  const {
    showTransactionOrBill,
    setShowTransactionOrBill,
    transactions,
    bills,
    categories,
    balance,
  } = context;

  return (
    <div className="grow flex flex-col items-center gap-6 pb-20">
      {/* Header */}
      <header className="w-full flex items-center justify-center relative pt-4">
        <h1 className="text-xl font-bold">Transactions</h1>
      </header>

      {/* Total Balance */}
      <div className="flex flex-col items-center">
        <p className="text-base">Total Balance</p>
        <p className="text-xl font-bold">{formatCurrency(balance)}</p>
      </div>

      {/* Transactions | Upcoming Bills */}
      <div className="w-full flex justify-around">
        <button
          className={clsx(
            "w-5/12 py-1 rounded-md",
            showTransactionOrBill == "transactions" && "bg-slate-800"
          )}
          onClick={(e) => {
            e.preventDefault();
            setShowTransactionOrBill("transactions");
          }}
        >
          Transactions
        </button>
        |
        <button
          className={clsx(
            "w-5/12 py-1 rounded-md",
            showTransactionOrBill == "bills" && "bg-slate-800"
          )}
          onClick={(e) => {
            e.preventDefault();
            setShowTransactionOrBill("bills");
          }}
        >
          Upcoming Bills
        </button>
      </div>

      <div className="w-11/12">
        {showTransactionOrBill === "transactions" ? (
          <div className="flex flex-col gap-2 items-center">
            <h1 className="text-2xl font-bold">Histórico</h1>
            <TransactionsComponent
              transactionsList={transactions}
              categories={categories}
            />
          </div>
        ) : (
          <BillsComponent bills={bills} categories={categories} />
        )}
      </div>
    </div>
  );
}
