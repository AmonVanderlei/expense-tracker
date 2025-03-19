"use client";
import { formatCurrency } from "@/utils/formatCurrency";
import { useContext, useEffect, useState } from "react";
import clsx from "clsx";
import TransactionsComponent from "@/components/TransactionsComponent";
import BillsComponent from "@/components/BillsComponent";
import { DataContext } from "@/contexts/dataContext";
import Transaction from "@/types/Transaction";
import Bill from "@/types/Bill";
import TransactionBillModal from "@/components/TransactionBillModal";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/contexts/authContext";
import Loading from "@/components/Loading";

export default function Transactions() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("DataContext must be used within a DataContextProvider");
  }
  const {
    showTransactionOrBill,
    setShowTransactionOrBill,
    dataCurrentMonth,
    transactions,
    bills,
    banks,
    categories,
    balance,
  } = context;

  const [modalIsOpen, setModalIsOpen] = useState<boolean>(true);
  const [selectedObj, setSelectedObj] = useState<Transaction | Bill | null>(
    null
  );
  const [hasMounted, setHasMounted] = useState(false);

  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("AuthContext must be used within a AuthContextProvider");
  }
  const { user, loading, messages } = authContext;
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
    <div className="grow flex flex-col items-center gap-6 pb-20">
      {selectedObj && (
        <TransactionBillModal
          show={modalIsOpen}
          onClose={setModalIsOpen}
          selectedObj={selectedObj}
          setSelectedObj={setSelectedObj}
        />
      )}

      {/* Header */}
      <header className="w-full flex flex-col items-center pt-4 gap-4">
        {/* Total Balance */}
        <div className="flex flex-col items-center">
          <p className="text-base">{messages.other.totalBalance}</p>
          <p className="text-xl font-bold">
            {formatCurrency(balance.totalBalance)}
          </p>
        </div>

        <div className="flex w-11/12 overflow-x-auto bg-slate-900 p-4 rounded-lg">
          {dataCurrentMonth.dataPerBank.map((bankData) => {
            return (
              <div
                key={bankData.bank.id}
                className="flex flex-col justify-end pr-4 mr-4 min-w-fit border-r-2"
              >
                <p
                  style={{
                    color: bankData.bank.color,
                  }}
                  className="text-xl font-bold"
                >
                  {bankData.bank.bankName}
                </p>
                <p>
                  {formatCurrency(balance[bankData.bank.bankName] as number)}
                </p>
              </div>
            );
          })}
        </div>
      </header>

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
          {messages.other.transactions}
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
          {messages.other.upcoming} {messages.other.bills}
        </button>
      </div>

      <div className="w-11/12 max-h-[80vh] overflow-y-auto">
        {showTransactionOrBill === "transactions" ? (
          <div className="flex flex-col gap-2 items-center">
            <h1 className="text-2xl font-bold">{messages.other.history}</h1>
            <TransactionsComponent
              transactionsList={transactions}
              banks={banks}
              categories={categories}
              setSelectedObj={setSelectedObj}
              openModal={setModalIsOpen}
            />
          </div>
        ) : (
          <BillsComponent
            bills={bills}
            setSelectedObj={setSelectedObj}
            openModal={setModalIsOpen}
          />
        )}
      </div>
    </div>
  );
}
