"use client";
import Notifications from "@/components/Notifications";
import { getUser } from "@/utils/data";
import { USERS, CATEGORIES, TRANSACTIONS } from "@/utils/constants";
import { formatCurrency } from "@/utils/formatCurrency";
import { useState } from "react";
import clsx from "clsx";
import { getRecentTransactions } from "@/utils/data";
import TransactionsComponent from "@/components/TransactionsComponent";

export default function Transactions() {
  const { balance } = getUser(USERS);
  const [show, setShow] = useState<string>("transactions");

  return (
    <div className="grow flex flex-col items-center gap-6 pb-20">
      {/* Header and Notifications */}
      <header className="w-full flex items-center justify-center relative pt-4">
        <h1 className="text-xl font-bold">Transactions</h1>
        <div className="absolute right-4">
          <Notifications />
        </div>
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
            show == "transactions" && "bg-slate-800"
          )}
          onClick={(e) => {
            e.preventDefault();
            setShow("transactions");
          }}
        >
          Transactions
        </button>
        |
        <button
          className={clsx(
            "w-5/12 py-1 rounded-md",
            show == "bills" && "bg-slate-800"
          )}
          onClick={(e) => {
            e.preventDefault();
            setShow("bills");
          }}
        >
          Upcoming Bills
        </button>
      </div>

      <div className="w-11/12">
        {show === "transactions" ? (
          <div className="flex flex-col gap-2 items-center">
            <h1 className="text-2xl font-bold">Histórico</h1>
            <TransactionsComponent
              transactionsList={getRecentTransactions(TRANSACTIONS)}
              categories={CATEGORIES}
            />
          </div>
        ) : (
          <div>bills</div>
        )}
      </div>
    </div>
  );
}
