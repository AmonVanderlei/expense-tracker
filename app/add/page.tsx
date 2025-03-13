"use client";
import { useRef, useState, useContext, useEffect } from "react";
import { DataContext } from "@/contexts/dataContext";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { AuthContext } from "@/contexts/authContext";
import { IoMdInformationCircleOutline } from "react-icons/io";

export default function Add() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("DataContext must be used within a DataContextProvider");
  }
  const { addObj, categories, banks } = context;

  const router = useRouter();

  const [show, setShow] = useState<string>("Transaction");
  const [type, setType] = useState<string>("Expense");
  const [categoryId, setCategoryId] = useState<string>("");
  const [bankId, setBankId] = useState<string>("");
  const [bank2bank, setBank2Bank] = useState<boolean>(false);

  const nameRef = useRef<HTMLInputElement | null>(null);
  const amountRef = useRef<HTMLInputElement | null>(null);
  const paymentDayRef = useRef<HTMLInputElement | null>(null);

  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("AuthContext must be used within a AuthContextProvider");
  }
  const { user, loading, messages } = authContext;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = nameRef.current?.value.trim();
    const amount = amountRef.current?.value.trim();

    if (!name || !amount || !type || !categoryId || !bankId) {
      toast.warning(messages.form.fillAll);
      return;
    }

    if (show === "Transaction") {
      addObj({
        id: "",
        type: type.toLowerCase() as "income" | "expense",
        destiny: name,
        date: new Date(),
        amount: +amount,
        categoryId,
        bankId,
        bank2bank,
        uid: user?.uid as string,
      });
    } else if (show === "Bill") {
      const paymentDay = paymentDayRef.current?.value.trim();
      if (!paymentDay) {
        toast.warning(messages.form.paymentDay);
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
        categoryId,
        bankId,
        bank2bank,
        uid: user?.uid as string,
      });
    }

    router.push("/");
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth");
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (banks.length < 1 || categories.length < 1) {
      router.push("/profile");
    }
  }, [banks, categories]);

  if (loading || !user) {
    return (
      <div className="grow w-full h-full flex items-center justify-center">
        <p className="text-xl">{messages.loading.loading}</p>
      </div>
    );
  }

  return (
    <div className="grow flex flex-col gap-4 items-center">
      <header className="w-full flex items-center justify-center relative pt-4">
        <h1
          className={clsx(
            "text-xl font-bold",
            type == "Income" ? "text-green-500" : "text-red-500"
          )}
        >
          {messages.button.add}{" "}
          {show == "Transaction"
            ? messages.other.transaction
            : messages.other.bill}
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
          <option value="Transaction">{messages.other.transaction}</option>
          <option value="Bill">{messages.other.bill}</option>
        </select>

        <select
          name="selectType"
          value={type}
          className="text-slate-800 rounded-md p-2 w-1/2"
          onChange={(e) => setType(e.target.value)}
        >
          <option value="Income">{messages.other.income}</option>
          <option value="Expense">{messages.other.expense}</option>
        </select>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-11/12">
        {/* Name */}
        <div className="flex flex-col gap-1">
          <label className="font-bold text-sm" htmlFor="name">
            {type === "Income" ? messages.form.from : messages.form.to}
          </label>
          <input
            type="text"
            name="name"
            className="p-2 rounded-xl bg-slate-700 border"
            ref={nameRef}
            placeholder={messages.form.type}
            required
          />
        </div>

        {/* Payment day */}
        {show === "Bill" && (
          <div className="flex flex-col gap-1">
            <label className="font-bold text-sm" htmlFor="paymentDay">
              {messages.form.payDay}
            </label>
            <input
              type="number"
              min={1}
              max={31}
              name="paymentDay"
              className="p-2 rounded-xl bg-slate-700 border"
              ref={paymentDayRef}
              placeholder={messages.form.type}
              required
            />
          </div>
        )}

        {/* Amount */}
        <div className="flex flex-col gap-1">
          <label className="font-bold text-sm" htmlFor="amount">
            {messages.form.amount}
          </label>
          <input
            type="number"
            min={0}
            step={0.01}
            name="amount"
            className="p-2 rounded-xl bg-slate-700 border"
            ref={amountRef}
            placeholder={messages.form.type}
            required
          />
        </div>

        {/* Category */}
        <div className="flex flex-col gap-1">
          <label className="font-bold text-sm" htmlFor="category">
            {messages.form.select} {messages.other.category.toLowerCase()}
          </label>
          <select
            name="category"
            value={categoryId}
            className="text-slate-800 rounded-md p-2 w-full"
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">
              {messages.other.chooseA} {messages.other.category.toLowerCase()}
            </option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Bank */}
        <div className="flex flex-col gap-1">
          <label className="font-bold text-sm" htmlFor="bank">
            {messages.form.select} {messages.other.bank.toLowerCase()}
          </label>
          <select
            name="bank"
            value={bankId}
            className="text-slate-800 rounded-md p-2 w-full"
            onChange={(e) => setBankId(e.target.value)}
          >
            <option value="">
              {messages.other.chooseA} {messages.other.bank.toLowerCase()}
            </option>
            {banks.map((bank) => (
              <option key={bank.id} value={bank.id}>
                {bank.bankName}
              </option>
            ))}
          </select>
        </div>

        {/* Bank to Bank Transfer */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="bank2bank"
            checked={bank2bank}
            onChange={() => setBank2Bank(!bank2bank)}
          />
          <label htmlFor="bank2bank" className="text-sm">
            {messages.form.bank2bank}
          </label>
          <div className="relative group">
            <IoMdInformationCircleOutline className="text-lg cursor-pointer group-hover:opacity-50" />
            <div className="bg-slate-700 p-2 rounded-lg text-sm absolute bottom-full mb-1 left-0 w-52 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200">
              {messages.form.bank2bankInfo}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full font-bold rounded-lg bg-slate-500 p-2 text-center"
        >
          {messages.button.add}{" "}
          {show == "Transaction"
            ? messages.other.transaction
            : messages.other.bill}
        </button>
      </form>
    </div>
  );
}
