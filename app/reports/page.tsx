"use client";
import { useState, useContext, useEffect } from "react";
import ExpensesChart from "@/components/ExpensesChart";
import IncomeChart from "@/components/IncomeChart";
import { DataContext } from "@/contexts/dataContext";
import { AuthContext } from "@/contexts/authContext";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading";

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
  const { transactions, dataPerYear } = context;

  const [month, setMonth] = useState<string>("");
  const [year, setYear] = useState<string>("");
  const [hasMounted, setHasMounted] = useState(false);

  const years = Array.from(
    new Set(transactions.map((t) => t.date.getFullYear()))
  );

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
    <div className="grow flex flex-col items-center gap-10 pb-20">
      {/* Header */}
      <header className="w-full flex items-center justify-center relative pt-4">
        <h1 className="text-xl font-bold">{messages.other.reports}</h1>
      </header>

      {/* Date Picker */}
      <div className="flex items-center justify-evenly w-11/12">
        <select
          name="selectMonth"
          value={month}
          id="selectMonth"
          className="text-slate-800 rounded-md p-2 w-2/5"
          onChange={(e) => setMonth(e.target.value)}
        >
          <option value="">Choose a Month</option>
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
          value={year}
          id="selectYear"
          className="text-slate-800 rounded-md p-2 w-2/5"
          onChange={(e) => setYear(e.target.value)}
        >
          <option value="">Choose a Year</option>
          {years.map((year) => {
            return (
              <option key={year} value={year}>
                {year}
              </option>
            );
          })}
        </select>
      </div>

      {month && year ? (
        <>
          {/* Expenses Graph */}
          <ExpensesChart
            dataPerYear={dataPerYear}
            setMonth={month}
            setYear={+year}
          />

          {/* Incomes and Expenses Graph */}
          <IncomeChart dataPerYear={dataPerYear} setYear={+year} />
        </>
      ) : (
        <p className="text-slate-400">{messages.form.selectBoth}</p>
      )}
    </div>
  );
}
