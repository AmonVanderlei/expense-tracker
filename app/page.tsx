"use client";
import Image from "next/image";
import profilePic from "@/public/blank-profile-picture.png";
import { FaRegBell } from "react-icons/fa";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { formatCurrency } from "./utils/formatCurrency";
import Link from "next/link";
import Transactions from "@/components/Transactions";
import Transaction from "./types/Transaction";

export default function Home() {
  // User Info and Notifications
  const [userName, setUserName] = useState<string>("UserName");
  // const [profilePic, setProfilePic] = useState<string>("url here");
  const [newNotifications, SetNewNotifications] = useState<boolean>(false);

  // Balance, Income and Expenses
  const [balance, setBalance] = useState<number>(0);
  const [income, setIncome] = useState<number>(0);
  const [expenses, setExpenses] = useState<number>(0);
  const [budget, setBudget] = useState<number>(0);

  // Transactions
  const [transactionsList, setTransactionsList] = useState<
    Transaction[] | null
  >(null);

  function hideNewNotifications() {
    SetNewNotifications(!newNotifications);
  }

  useEffect(() => {
    setUserName("Amon Vanderlei");
    SetNewNotifications(true);
    setBalance(12843.2);
    setIncome(1242.29);
    setExpenses(1999.99);
    setBudget(5000.0);
    setTransactionsList([
      {
        id: new Date().getTime(),
        type: "income",
        origin: "Bolsa",
        description: "Bolsa do NES",
        destiny: "Amon Vanderlei",
        date: new Date("2024-12-20"),
        amount: 500,
        method: "pix",
        category: "Estudos",
      },
      {
        id: new Date().getTime() + 1,
        type: "expense",
        origin: "Amon Vanderlei",
        destiny: "TIM",
        date: new Date("2024-12-12"),
        amount: 50,
        method: "pix",
        category: "Celular",
      },
    ]);
  }, []);

  return (
    <div className="grow flex flex-col items-center gap-5">
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
        <div
          className="flex items-center relative"
          onClick={hideNewNotifications}
        >
          <FaRegBell className="text-2xl" />
          <div
            className={clsx(
              "w-3 h-3 text-transparent absolute top-3 right-0 rounded-full bg-none",
              newNotifications && "bg-red-600"
            )}
          >
            .
          </div>
        </div>
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
        <Transactions transactionsList={transactionsList} />
      </div>
    </div>
  );
}
