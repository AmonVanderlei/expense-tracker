"use client";
import Notifications from "@/components/Notifications";
import Budget from "@/components/Budget";
import { useEffect, useState } from "react";
import ExpensesChart from "@/components/ExpensesChart";
import { CATEGORIES, TRANSACTIONS } from "@/utils/constants";
import IncomeChart from "@/components/IncomeChart";

export default function Reports() {
  const [expenses, setExpenses] = useState<number>(0);
  const [budget, setBudget] = useState<number>(0);

  useEffect(() => {
    setExpenses(1999.99);
    setBudget(5000.0);
  }, []);

  return (
    <div className="grow flex flex-col items-center gap-10 pb-20">
      {/* Header and Notifications */}
      <header className="w-full flex items-center justify-center relative pt-4">
        <h1 className="text-xl font-bold">Reports</h1>
        <div className="absolute right-4">
          <Notifications />
        </div>
      </header>

      {/* Budget */}
      <Budget budget={budget} expenses={expenses} />

      {/* Expenses Graph */}
      <ExpensesChart transactions={TRANSACTIONS} categories={CATEGORIES} />

      {/* Incomes and Expenses Graph */}
      <IncomeChart transactions={TRANSACTIONS} />
    </div>
  );
}
