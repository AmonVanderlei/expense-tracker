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
  addTransaction: (transaction: Transaction) => void;
  bills: Bill[];
  nextBills: Bill[];
  updateBill: (bill: Bill) => void;
  categories: Category[];
  dataCurrentMonth: MonthData;
  dataPerYear: YearData[];
}

export const DataContext = createContext<DataContextType | null>(null);

interface Props {
  children: React.ReactNode;
}

export default function DataContextProvider({ children }: Props) {
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>(
    []
  );
  const [bills, setBills] = useState<Bill[]>([]);
  const [nextBills, setNextBills] = useState<Bill[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [dataCurrentMonth, setDataCurrentMonth] = useState<MonthData>({
    income: 0,
    expenses: 0,
    diff: 0,
    monthStr: "",
    expensesPerCategory: [],
  });
  const [dataPerYear, setDataPerYear] = useState<YearData[]>([]);
  const [showTransactionOrBill, setShowTransactionOrBill] =
    useState<string>("transactions");

  useEffect(() => {
    setTimeout(() => {
      setTransactions(getRecentTransactions(TRANSACTIONS));
      setBills(getNextBills(BILLS));
      setCategories(CATEGORIES);
    }, 1);
  }, []);

  const user = getUser(USERS);

  useEffect(() => {
    setBalance(getBalance(transactions));
    setRecentTransactions(getRecentTransactions(transactions, 5));
    setNextBills(getNextBills(bills, 5));
    setDataCurrentMonth(
      getDataPerMonth(
        transactions,
        categories,
        new Date().getFullYear(),
        new Date().getMonth()
      )
    );
    setDataPerYear(getDataPerYear(transactions, categories));
  }, [transactions, bills, categories]);

  function addTransaction(transaction: Transaction) {
    setTransactions((prevState) => {
      return [...prevState, transaction];
    });
  }

  function updateBill(bill: Bill) {
    setBills((prevState) => {
      const oldBills: Bill[] = prevState.filter((b: Bill) => b.id != bill.id);
      return [...oldBills, bill];
    });
  }

  const values: DataContextType = {
    user,
    balance,
    showTransactionOrBill,
    setShowTransactionOrBill,
    transactions,
    recentTransactions,
    addTransaction,
    bills,
    nextBills,
    updateBill,
    categories,
    dataCurrentMonth,
    dataPerYear,
  };

  return <DataContext.Provider value={values}>{children}</DataContext.Provider>;
}
