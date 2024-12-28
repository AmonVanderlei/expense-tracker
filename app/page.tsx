"use client";
import Image from "next/image";
import profilePic from "@/public/blank-profile-picture.png";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { formatCurrency } from "@/utils/formatCurrency";
import Link from "next/link";
import Transactions from "@/components/Transactions";
import Transaction from "@/types/Transaction";
import Notifications from "@/components/Notifications";
import Budget from "@/components/Budget";
import { TRANSACTIONS, CATEGORIES } from "@/utils/constants";

export default function Home() {
  // User Info and Notifications
  const [userName, setUserName] = useState<string>("UserName");
  // const [profilePic, setProfilePic] = useState<string>("url here");

  // Balance, Income and Expenses
  const [balance, setBalance] = useState<number>(0);
  const [income, setIncome] = useState<number>(0);
  const [expenses, setExpenses] = useState<number>(0);
  const [budget, setBudget] = useState<number>(0);

  // Transactions
  const [transactionsList, setTransactionsList] = useState<
    Transaction[] | null
  >(null);

  useEffect(() => {
    setUserName("Amon Vanderlei");
    setBalance(12843.2);
    setIncome(1242.29);
    setExpenses(1999.99);
    setBudget(5000.0);
    setTransactionsList(TRANSACTIONS);
  }, []);

  return (
    <div className="grow flex flex-col items-center gap-10">
      {/* User Info and Notifications */}
      <div className="w-full flex justify-between px-3 pt-3">
        <div className="flex items-center gap-3">
          <Image
            src={profilePic}
            alt="Profile picture"
            width={40}
            height={40}
            className="rounded-full"
          />
          <div className="flex flex-col">
            <p className="text-sm">Hello,</p>
            <p className="text-lg font-bold">{userName}</p>
          </div>
        </div>
        <Notifications />
      </div>

      {/* Incomes and Expenses */}
      <div className="w-11/12 bg-slate-900 rounded-lg p-4 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base">Total Balance</h2>
            <p className="text-3xl font-semibold">{formatCurrency(balance)}</p>
          </div>
          <p
            className={clsx(
              "text-lg",
              income - expenses > 0 && "text-green-500",
              income - expenses < 0 && "text-red-500"
            )}
          >
            {formatCurrency(income - expenses)}
          </p>
        </div>
        <div className="flex w-full justify-between">
          <div className="flex flex-col items-start justify-center">
            <div className="flex items-center gap-2">
              <div className="bg-slate-50 bg-opacity-25 p-1 rounded-full">
                <FaArrowDown />
              </div>
              <h3 className="font-semibold">Income</h3>
            </div>
            <p className="font-medium text-lg">{formatCurrency(income)}</p>
          </div>
          <div className="flex flex-col items-end justify-center">
            <div className="flex items-center gap-2">
              <div className="bg-slate-50 bg-opacity-25 p-1 rounded-full">
                <FaArrowUp />
              </div>
              <h3 className="font-semibold">Expenses</h3>
            </div>
            <p className="font-medium text-lg">{formatCurrency(expenses)}</p>
          </div>
        </div>
      </div>

      {/* Monthly Budget */}
      <Budget budget={budget} expenses={expenses} />

      {/* Recent Transactions */}
      <div className="w-11/12">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl text-blue-500 font-bold">
            Recent Transactions
          </h2>
          <Link href="/transactions" className="text-sm">
            See All
          </Link>
        </div>
        <Transactions
          transactionsList={transactionsList}
          categories={CATEGORIES}
        />
      </div>
    </div>
  );
}
