"use client";
import { useState, useContext } from "react";
import ExpensesChart from "@/components/ExpensesChart";
import IncomeChart from "@/components/IncomeChart";
import { DataContext } from "@/contexts/dataContext";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function Reports() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("DataContext must be used within a DataContextProvider");
  }
  const { transactions, categories, dataPerYear } = context;

  const [month, setMonth] = useState<string>(months[new Date().getMonth()]);
  const [year, setYear] = useState<number>(new Date().getFullYear());

  const years = Array.from(
    new Set(transactions.map((t) => t.date.getFullYear()))
  );

  return (
    <div className="grow flex flex-col items-center gap-10 pb-20">
      {/* Header */}
      <header className="w-full flex items-center justify-center relative pt-4">
        <h1 className="text-xl font-bold">Reports</h1>
      </header>

      {/* Date Picker */}
      <div className="flex items-center justify-evenly w-11/12">
        <select
          name="selectMonth"
          defaultValue={months[new Date().getMonth()]}
          id="selectMonth"
          className="text-slate-800 rounded-md p-2 w-2/5"
          onChange={(e) => {
            e.preventDefault();
            setMonth(e.target.value);
          }}
        >
          {months.map((month) => {
            return (
              <option key={month} value={month}>
                {month}
              </option>
            );
          })}
        </select>
        <select
          name="selectYear"
          defaultValue={new Date().getFullYear()}
          id="selectYear"
          className="text-slate-800 rounded-md p-2 w-2/5"
          onChange={(e) => {
            e.preventDefault();
            setYear(+e.target.value);
          }}
        >
          {years.map((year) => {
            return (
              <option key={year} value={year}>
                {year}
              </option>
            );
          })}
        </select>
      </div>

      {/* Expenses Graph */}
      <ExpensesChart
        dataPerYear={dataPerYear}
        setMonth={month}
        setYear={year}
      />

      {/* Incomes and Expenses Graph */}
      <IncomeChart
        dataPerYear={dataPerYear}
        setYear={year}
      />
    </div>
  );
}
