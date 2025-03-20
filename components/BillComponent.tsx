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
  const {
    visibleValues,
    banks,
    categories,
    addObj,
    updateObj,
    setShowTransactionOrBill,
  } = context;
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("AuthContext must be used within a AuthContextProvider");
  }
  const { user, messages } = authContext;

  function bill2transactionHandler(bill: Bill) {
    addObj({
      id: "",
      type: bill.type,
      destiny: bill.destiny,
      date: new Date(),
      amount: bill.amount,
      categoryId: bill.categoryId,
      bankId: bill.bankId,
      bank2bank: bill.bank2bank,
      uid: user?.uid as string,
    });

    updateObj({
      ...bill,
      paid: true,
      nextPayment: new Date(
        new Date().getFullYear(),
        new Date().getMonth() + 1,
        1
      ),
    });

    setShowTransactionOrBill("transactions");
    if (bill.type === "income") {
      toast.success(bill.destiny + messages.success.received);
    } else {
      toast.success(bill.destiny + messages.success.paid);
    }
  }

  const category = categories.find((cat) => cat.id === obj.categoryId);
  const bank = banks?.find((b) => b.id === obj.bankId);
  return (
    <div
      className={clsx(
        "flex flex-col items-center w-full gap-2",
        obj.paid && "opacity-50"
      )}
    >
      <div
        style={{ borderBlockColor: bank?.color }}
        className="flex justify-between items-center w-full border-b-2 pb-2 flex-wrap"
      >
        <div
          className="grow flex items-center justify-between mr-2 gap-1 flex-wrap"
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
          {visibleValues ? (
            <p
              className={clsx(
                obj.type == "income" && "text-green-500",
                obj.type == "expense" && "text-red-500"
              )}
            >
              {formatCurrency(obj.amount)}
            </p>
          ) : (
            <p className="text-xl font-bold">* * * *</p>
          )}
        </div>

        {!obj.paid &&
          (obj.type === "income" ? (
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
          ))}
      </div>
    </div>
  );
}
