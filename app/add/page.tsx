"use client";
import { useRef, useState, useContext } from "react";
import { DataContext } from "@/contexts/dataContext";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function Add() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("DataContext must be used within a DataContextProvider");
  }
  const { user, addObj, categories } = context;

  const router = useRouter();

  const [show, setShow] = useState<string>("Transaction");
  const [type, setType] = useState<string>("Income");
  const [categoryId, setCategoryId] = useState<string>("");

  const nameRef = useRef<HTMLInputElement | null>(null);
  const amountRef = useRef<HTMLInputElement | null>(null);
  const paymentDayRef = useRef<HTMLInputElement | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = nameRef.current?.value.trim();
    const amount = amountRef.current?.value.trim();

    if (!name || !amount || !type || !user || !categoryId) {
      toast.warning("Please fill out all fields.");
      return;
    }

    if (show === "Transaction") {
      addObj({
        id: "",
        type: type.toLowerCase() as "income" | "expense",
        destiny: name,
        date: new Date(),
        amount: +amount,
        categoryId: categoryId,
      });
    } else if (show === "Bill") {
      const paymentDay = paymentDayRef.current?.value.trim();
      if (!paymentDay) {
        toast.warning("Please provide a payment day.");
        return;
      }

      addObj({
        id: "",
        type: type.toLowerCase() as "income" | "expense",
        paid: false,
        destiny: name,
        paymentDay: +paymentDay,
        nextPayment: new Date(),
        amount: +amount,
        categoryId: categoryId,
      });
    }

    router.push("/");
  };

  return (
    <div className="grow flex flex-col gap-4 items-center">
      <header className="w-full flex items-center justify-center relative pt-4">
        <h1
          className={clsx(
            "text-xl font-bold",
            type == "Income" ? "text-green-500" : "text-red-500"
          )}
        >
          Add {show}
        </h1>
      </header>

      {/* Select type of form */}
      <div className="flex items-center justify-between w-11/12 gap-2">
        <select
          name="transactionOrBill"
          value={show}
          className="text-slate-800 rounded-md p-2 w-1/2"
          onChange={(e) => setShow(e.target.value)}
        >
          <option value="Transaction">Transaction</option>
          <option value="Bill">Bill</option>
        </select>

        <select
          name="selectType"
          value={type}
          className="text-slate-800 rounded-md p-2 w-1/2"
          onChange={(e) => setType(e.target.value)}
        >
          <option value="Income">Income</option>
          <option value="Expense">Expense</option>
        </select>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-11/12">
        <div className="flex flex-col gap-1">
          <label className="font-bold text-sm" htmlFor="name">
            {type === "Income" ? "Payment sender" : "Payment receiver"}
          </label>
          <input
            type="text"
            name="name"
            className="p-2 rounded-xl bg-slate-700 border"
            ref={nameRef}
            placeholder="Type here"
            required
          />
        </div>

        {show === "Bill" && (
          <div className="flex flex-col gap-1">
            <label className="font-bold text-sm" htmlFor="paymentDay">
              Which day will it be paid?
            </label>
            <input
              type="number"
              name="paymentDay"
              className="p-2 rounded-xl bg-slate-700 border"
              ref={paymentDayRef}
              placeholder="Type here"
              required
            />
          </div>
        )}

        <div className="flex flex-col gap-1">
          <label className="font-bold text-sm" htmlFor="amount">
            Amount of money
          </label>
          <input
            type="number"
            name="amount"
            className="p-2 rounded-xl bg-slate-700 border"
            ref={amountRef}
            placeholder="Type here"
            required
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-bold text-sm" htmlFor="category">
            Select category
          </label>
          <select
            name="category"
            value={categoryId}
            className="text-slate-800 rounded-md p-2 w-full"
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">Choose a category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full font-bold rounded-lg bg-slate-500 p-2 text-center"
        >
          Add {show}
        </button>
      </form>
    </div>
  );
}
