"use client";
import Image from "next/image";
import clsx from "clsx";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { formatCurrency } from "@/utils/formatCurrency";
import Link from "next/link";
import TransactionsComponent from "@/components/TransactionsComponent";
import Budget from "@/components/Budget";
import BillsComponent from "@/components/BillsComponent";
import { useContext, useEffect, useState } from "react";
import { DataContext } from "@/contexts/dataContext";
import TransactionBillModal from "@/components/TransactionBillModal";
import Transaction from "@/types/Transaction";
import Bill from "@/types/Bill";
import { AuthContext } from "@/contexts/authContext";
import { useRouter } from "next/navigation";

export default function Home() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("DataContext must be used within a DataContextProvider");
  }
  const {
    dataCurrentMonth,
    balance,
    recentTransactions,
    nextBills,
    categories,
    setShowTransactionOrBill,
  } = context;

  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("AuthContext must be used within a AuthContextProvider");
  }
  const { user, loading } = authContext;

  const [modalIsOpen, setModalIsOpen] = useState<boolean>(true);
  const [selectedObj, setSelectedObj] = useState<Transaction | Bill | null>(
    null
  );

  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth");
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="grow w-full h-full flex items-center justify-center">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  return (
    <div className="grow flex flex-col items-center gap-10 pb-32">
      {selectedObj && (
        <TransactionBillModal
          show={modalIsOpen}
          onClose={setModalIsOpen}
          selectedObj={selectedObj}
          setSelectedObj={setSelectedObj}
        />
      )}

      {/* User Info */}
      <div className="w-full flex justify-between px-3 pt-3">
        <div className="flex items-center gap-3">
          {user?.photoURL && (
            <Image
              src={user?.photoURL as string}
              alt="Profile picture"
              width={40}
              height={40}
              className="rounded-full"
            />
          )}
          <div className="flex flex-col">
            <p className="text-sm">Hello,</p>
            <p className="text-lg font-bold">{user?.displayName}</p>
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
              dataCurrentMonth.diff > 0 && "text-green-500",
              dataCurrentMonth.diff < 0 && "text-red-500"
            )}
          >
            {formatCurrency(dataCurrentMonth.diff)}
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
            <p className="font-medium text-lg">
              {formatCurrency(dataCurrentMonth.income)}
            </p>
          </div>
          <div className="flex flex-col items-end justify-center">
            <div className="flex items-center gap-2">
              <div className="bg-slate-50 bg-opacity-25 p-1 rounded-full">
                <FaArrowUp />
              </div>
              <h3 className="font-semibold">Expenses</h3>
            </div>
            <p className="font-medium text-lg">
              {formatCurrency(dataCurrentMonth.expenses)}
            </p>
          </div>
        </div>
      </div>

      {/* Monthly Budget */}
      <Budget expenses={dataCurrentMonth.expenses} />

      {/* Upcoming Bills */}
      {nextBills?.length > 0 ? (
        <div className="w-11/12">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl text-blue-500 font-bold">Upcoming Bills</h2>
            <Link
              href="/transactions"
              className="text-sm"
              onClick={() => {
                setShowTransactionOrBill("bills");
              }}
            >
              See All
            </Link>
          </div>
          <BillsComponent
            bills={nextBills}
            setSelectedObj={setSelectedObj}
            openModal={setModalIsOpen}
          />
        </div>
      ) : null}

      {/* Recent Transactions */}
      <div className="w-11/12">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl text-blue-500 font-bold">
            Recent Transactions
          </h2>
          <Link
            href="/transactions"
            className="text-sm"
            onClick={() => {
              setShowTransactionOrBill("transactions");
            }}
          >
            See All
          </Link>
        </div>
        <TransactionsComponent
          transactionsList={recentTransactions}
          categories={categories}
          setSelectedObj={setSelectedObj}
          openModal={setModalIsOpen}
        />
      </div>
    </div>
  );
}
