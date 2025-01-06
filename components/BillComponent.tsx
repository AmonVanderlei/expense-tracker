"use client";
import { AuthContext } from "@/contexts/authContext";
import { DataContext } from "@/contexts/dataContext";
import Bill from "@/types/Bill";
import Transaction from "@/types/Transaction";
import { formatCurrency } from "@/utils/formatCurrency";
import clsx from "clsx";
import { Dispatch, SetStateAction, useContext } from "react";
import { toast } from "react-toastify";

interface Props {
  obj: Bill;
  setSelectedObj: Dispatch<SetStateAction<Transaction | Bill | null>>;
  openModal: Dispatch<SetStateAction<boolean>>;
}

export default function BillComponent({
  obj,
  setSelectedObj,
  openModal,
}: Props) {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("DataContext must be used within a DataContextProvider");
  }
  const { categories, addObj, updateObj, setShowTransactionOrBill } = context;
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("AuthContext must be used within a AuthContextProvider");
  }
  const { user, messages } = authContext;

  function bill2transactionHandler(bill: Bill) {
    if (bill.type === "income") {
      addObj({
        id: "",
        type: "income",
        destiny: bill.destiny,
        date: new Date(),
        amount: bill.amount,
        categoryId: bill.categoryId,
        uid: user?.uid as string,
      });
    } else {
      addObj({
        id: "",
        type: "expense",
        destiny: bill.destiny,
        date: new Date(),
        amount: bill.amount,
        categoryId: bill.categoryId,
        uid: user?.uid as string,
      });
    }

    updateObj({
      id: bill.id,
      type: bill.type,
      paid: true,
      destiny: bill.destiny,
      paymentDay: bill.paymentDay,
      nextPayment: new Date(
        new Date().getFullYear(),
        new Date().getMonth() + 1,
        1
      ),
      amount: bill.amount,
      categoryId: bill.categoryId,
      uid: user?.uid as string,
    });

    setShowTransactionOrBill("transactions");
    if (bill.type === "income") {
      toast.success(bill.destiny + messages.success.received);
    } else {
      toast.success(bill.destiny + messages.success.paid);
    }
  }

  const category = categories.find((cat) => cat.id === obj.categoryId);
  return (
    <div className="flex flex-col items-center w-full gap-2">
      <div className="flex justify-between items-center w-full">
        <div
          className="grow flex items-center justify-between mr-2"
          onClick={() => {
            setSelectedObj(obj);
            openModal(true);
          }}
        >
          <div>
            <h1 className="text-lg font-semibold">{obj.destiny}</h1>
            <p className="text-sm">
              {messages.form.payDay}: {obj.paymentDay}
            </p>
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
        {obj.type === "income" ? (
          <button
            className="bg-green-500 bg-opacity-75 py-2 px-4 rounded-lg"
            onClick={(e) => {
              e.preventDefault();
              bill2transactionHandler(obj);
            }}
          >
            {messages.button.receive}
          </button>
        ) : (
          <button
            className="bg-red-500 bg-opacity-75 py-2 px-4 rounded-lg"
            onClick={(e) => {
              e.preventDefault();
              bill2transactionHandler(obj);
            }}
          >
            {messages.button.pay}
          </button>
        )}
      </div>
    </div>
  );
}
