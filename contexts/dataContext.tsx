"use client";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import {
  getUser,
  getBalance,
  getDataPerMonth,
  getRecentTransactions,
  getDataPerYear,
  getNextBills,
} from "@/utils/data";
import { TRANSACTIONS, USERS, CATEGORIES, BILLS } from "@/utils/constants";
import { YearData, MonthData } from "@/types/Data";
import User from "@/types/User";
import Transaction from "@/types/Transaction";
import Bill from "@/types/Bill";
import Category from "@/types/Category";

export interface DataContextType {
  user: User;
  balance: number;
  showTransactionOrBill: string;
  setShowTransactionOrBill: Dispatch<SetStateAction<string>>;
  transactions: Transaction[];
  recentTransactions: Transaction[];
  bills: Bill[];
  nextBills: Bill[];
  categories: Category[];
  dataCurrentMonth: MonthData;
  dataPerYear: YearData[];
}

export const DataContext = createContext<DataContextType | null>(null);

interface Props {
  children: React.ReactNode;
}

export default function DataContextProvider({ children }: Props) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showTransactionOrBill, setShowTransactionOrBill] =
    useState<string>("transactions");

  useEffect(() => {
    setTimeout(() => {
      setTransactions(getRecentTransactions(TRANSACTIONS));
      setBills(BILLS);
      setCategories(CATEGORIES);
    }, 1);
  }, []);

  const user = getUser(USERS);
  let balance = getBalance(transactions);
  let recentTransactions = getRecentTransactions(transactions, 5);
  let nextBills = getNextBills(bills, 5);
  let dataCurrentMonth = getDataPerMonth(
    transactions,
    categories,
    new Date().getFullYear(),
    new Date().getMonth()
  );
  let dataPerYear = getDataPerYear(transactions, categories);

  useEffect(() => {
    balance = getBalance(transactions);
    recentTransactions = getRecentTransactions(transactions, 5);
    nextBills = getNextBills(bills, 5);
    dataCurrentMonth = getDataPerMonth(
      transactions,
      categories,
      new Date().getFullYear(),
      new Date().getMonth()
    );
    dataPerYear = getDataPerYear(transactions, categories);
  }, [transactions, bills, categories]);

  const values: DataContextType = {
    user,
    balance,
    showTransactionOrBill,
    setShowTransactionOrBill,
    transactions,
    recentTransactions,
    bills,
    nextBills,
    categories,
    dataCurrentMonth,
    dataPerYear,
  };

  return <DataContext.Provider value={values}>{children}</DataContext.Provider>;
}
