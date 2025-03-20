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
import Loading from "@/components/Loading";
import Eye from "@/components/Eye";

export default function Home() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("DataContext must be used within a DataContextProvider");
  }
  const {
    visibleValues,
    dataCurrentMonth,
    balance,
    recentTransactions,
    nextBills,
    banks,
    categories,
    setShowTransactionOrBill,
  } = context;

  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("AuthContext must be used within a AuthContextProvider");
  }
  const { user, loading, messages } = authContext;

  const [modalIsOpen, setModalIsOpen] = useState<boolean>(true);
  const [selectedObj, setSelectedObj] = useState<Transaction | Bill | null>(
    null
  );
  const [bankMenu, setBankMenu] = useState<boolean>(false);
  const [hasMounted, setHasMounted] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth");
    }
  }, [loading, user, router]);

  if (!hasMounted || loading) {
    return (
      <div className="absolute top-1/2 left-[47%]">
        <Loading />
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
      <div className="w-full flex justify-between items-center px-3 pt-3">
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
            <p className="text-sm">{messages.other.hello},</p>
            <p className="text-lg font-bold">{user?.displayName}</p>
          </div>
        </div>
        <Eye />
      </div>

      {/* Incomes and Expenses */}
      <div
        className="w-11/12 bg-slate-900 rounded-lg py-4 flex flex-col"
        onClick={() => setBankMenu((prevState) => !prevState)}
      >
        <div className="flex items-center justify-between mb-6 px-4 flex-wrap">
          <div>
            <h2 className="text-base">{messages.other.totalBalance}</h2>
            <p className="text-3xl font-semibold">
              {visibleValues ? formatCurrency(balance.totalBalance) : "* * * *"}
            </p>
          </div>
          {visibleValues ? (
            <p
              className={clsx(
                "text-lg",
                dataCurrentMonth.diff > 0 && "text-green-500",
                dataCurrentMonth.diff < 0 && "text-red-500"
              )}
            >
              {formatCurrency(dataCurrentMonth.diff)}
            </p>
          ) : (
            <p className="text-xl font-bold">* * * *</p>
          )}
        </div>

        <div className="flex w-full justify-between px-4 mb-2 flex-wrap">
          <div className="flex flex-col items-start justify-center">
            <div className="flex items-center gap-2">
              <div className="bg-slate-50 bg-opacity-25 p-1 rounded-full">
                <FaArrowDown />
              </div>
              <h3 className="font-semibold">{messages.other.income}</h3>
            </div>
            <p className="font-medium text-lg">
              {visibleValues
                ? formatCurrency(dataCurrentMonth.income)
                : "* * * *"}
            </p>
          </div>
          <div className="flex flex-col items-end justify-center">
            <div className="flex items-center gap-2">
              <div className="bg-slate-50 bg-opacity-25 p-1 rounded-full">
                <FaArrowUp />
              </div>
              <h3 className="font-semibold">{messages.other.expenses}</h3>
            </div>
            <p className="font-medium text-lg">
              {visibleValues
                ? formatCurrency(dataCurrentMonth.expenses)
                : "* * * *"}
            </p>
          </div>
        </div>

        {bankMenu &&
          dataCurrentMonth.dataPerBank.map((bankData) => {
            return (
              <div
                key={bankData.bank.id}
                style={{
                  color: bankData.bank.color,
                  borderColor: bankData.bank.color,
                }}
                className="flex justify-between p-4 border-x-2 items-center flex-wrap"
              >
                <div className="max-w-[50%]">
                  <p className="text-xl font-bold">{bankData.bank.bankName}</p>
                  <p>
                    {visibleValues
                      ? formatCurrency(
                          balance[bankData.bank.bankName] as number
                        )
                      : "* * * *"}
                  </p>
                </div>
                <div>
                  <p className="text-green-500">
                    {visibleValues
                      ? formatCurrency(bankData.income)
                      : "* * * *"}
                  </p>
                  <p className="text-red-500">
                    {visibleValues
                      ? formatCurrency(bankData.expenses)
                      : "* * * *"}
                  </p>
                  {visibleValues ? (
                    <p
                      className={clsx(
                        "text-base border-t-2 border-slate-600",
                        bankData.diff > 0 && "text-green-500",
                        bankData.diff < 0 && "text-red-500"
                      )}
                    >
                      {formatCurrency(bankData.diff)}
                    </p>
                  ) : (
                    <p className="text-base border-t-2 border-slate-600">* * * *</p>
                  )}
                </div>
              </div>
            );
          })}
      </div>

      {/* Monthly Budget */}
      <Budget expenses={dataCurrentMonth.expenses} />

      {/* Upcoming Bills */}
      {nextBills?.length > 0 ? (
        <div className="w-11/12">
          <div className="flex items-center justify-between mb-2 flex-wrap">
            <h2 className="text-xl text-blue-500 font-bold">
              {messages.other.upcoming} {messages.other.bills}
            </h2>
            <Link
              href="/transactions"
              className="text-sm"
              onClick={() => {
                setShowTransactionOrBill("bills");
              }}
            >
              {messages.other.all}
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
        <div className="flex items-center justify-between mb-2 flex-wrap">
          <h2 className="text-xl text-blue-500 font-bold">
            {messages.other.last} {messages.other.transactions}
          </h2>
          <Link
            href="/transactions"
            className="text-sm"
            onClick={() => {
              setShowTransactionOrBill("transactions");
            }}
          >
            {messages.other.all}
          </Link>
        </div>
        <TransactionsComponent
          transactionsList={recentTransactions}
          banks={banks}
          categories={categories}
          setSelectedObj={setSelectedObj}
          openModal={setModalIsOpen}
        />
      </div>
    </div>
  );
}
