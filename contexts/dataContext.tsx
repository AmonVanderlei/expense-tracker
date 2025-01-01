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
  updateTransaction: (transaction: Transaction) => void;
  deleteTransaction: (transaction: Transaction) => void;
  bills: Bill[];
  nextBills: Bill[];
  addBill: (bill: Bill) => void;
  updateBill: (bill: Bill) => void;
  deleteBill: (bill: Bill) => void;
  categories: Category[];
  addCategory: (category: Category) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (category: Category) => void;
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
      return getRecentTransactions([...prevState, transaction]);
    });
  }

  function updateTransaction(transaction: Transaction) {
    setTransactions((prevState) => {
      const updatedTransactions = prevState.map((t) =>
        t.id === transaction.id ? { ...t, ...transaction } : t
      );
      return getRecentTransactions(updatedTransactions);
    });
  }

  function deleteTransaction(transaction: Transaction) {
    setTransactions((prevState) => {
      const updatedTransactions = prevState.filter(
        (t) => t.id !== transaction.id
      );
      return getRecentTransactions(updatedTransactions);
    });
  }

  function addBill(bill: Bill) {
    setBills((prevState) => {
      return getNextBills([...prevState, bill]);
    });
  }

  function updateBill(bill: Bill) {
    setBills((prevState) => {
      const updatedBills = prevState.map((b) =>
        b.id === bill.id ? { ...b, ...bill } : b
      );
      return getNextBills(updatedBills);
    });
  }

  function deleteBill(bill: Bill) {
    setBills((prevState) => {
      const updatedBills = prevState.filter((b) => b.id !== bill.id);
      return getNextBills(updatedBills);
    });
  }

  function addCategory(category: Category) {
    setCategories((prevState) => {
      return [...prevState, category];
    });
  }

  function updateCategory(category: Category) {
    setCategories((prevState) => {
      const updatedCategories = prevState.map((c) =>
        c.id === category.id ? { ...c, ...category } : c
      );
      return updatedCategories;
    });
  }

  function deleteCategory(category: Category) {
    setCategories((prevState) => {
      const updatedCategories = prevState.filter(
        (cat) => cat.id !== category.id
      );
      return updatedCategories;
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
    updateTransaction,
    deleteTransaction,
    bills,
    nextBills,
    addBill,
    updateBill,
    deleteBill,
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    dataCurrentMonth,
    dataPerYear,
  };

  return <DataContext.Provider value={values}>{children}</DataContext.Provider>;
}
