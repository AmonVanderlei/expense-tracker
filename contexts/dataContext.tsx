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
import { toast, ToastContentProps } from "react-toastify";
import Transactions from "@/components/TransactionComponent";

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
  addObj: (obj: Transaction | Bill | Category, showToast?: boolean) => void;
  updateObj: (obj: Transaction | Bill | Category, showToast?: boolean) => void;
  deleteObj: (obj: Transaction | Bill | Category, showToast?: boolean) => void;
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

  function addObj(
    obj: Transaction | Bill | Category,
    showToast: boolean = true
  ) {
    if ("date" in obj) {
      setTransactions((prevState) => {
        return getRecentTransactions([...prevState, obj as Transaction]);
      });
      if (showToast)
        toast.success(
          (obj as Transaction).destiny + " was successfully added!"
        );
    } else if ("paymentDay" in obj) {
      setBills((prevState) => {
        return getNextBills([...prevState, obj as Bill]);
      });
      if (showToast)
        toast.success((obj as Bill).destiny + " was successfully added!");
    } else {
      setCategories((prevState) => {
        return [...prevState, obj as Category];
      });
      if (showToast)
        toast.success((obj as Category).name + " was successfully added!");
    }
  }

  function updateObj(
    obj: Transaction | Bill | Category,
    showToast: boolean = true
  ) {
    if ("date" in obj) {
      setTransactions((prevState) => {
        const updatedTransactions = prevState.map((t) =>
          t.id === obj.id ? { ...t, ...obj } : t
        );
        return getRecentTransactions(updatedTransactions);
      });
      if (showToast)
        toast.success(
          (obj as Transaction).destiny + " was successfully updated!"
        );
    } else if ("paymentDay" in obj) {
      setBills((prevState) => {
        const updatedBills = prevState.map((b) =>
          b.id === obj.id ? { ...b, ...obj } : b
        );
        return getNextBills(updatedBills);
      });
      if (showToast)
        toast.success((obj as Bill).destiny + " was successfully updated!");
    } else {
      setCategories((prevState) => {
        const updatedCategories = prevState.map((c) =>
          c.id === obj.id ? { ...c, ...obj } : c
        );
        return updatedCategories;
      });
      if (showToast)
        toast.success((obj as Category).name + " was successfully updated!");
    }
  }

  function CustomNotification({ closeToast }: ToastContentProps) {
    return (
      <div className="flex flex-col gap-2 w-full">
        Are you sure you want to delete it?
        <div className="flex w-full gap-2">
          <button
            className="font-bold rounded-lg bg-slate-500 p-2 text-center w-1/2"
            onClick={closeToast}
          >
            Cancel
          </button>
          <button
            className="font-bold rounded-lg bg-red-500 p-2 text-center w-1/2"
            onClick={() => closeToast("delete")}
          >
            Delete
          </button>
        </div>
      </div>
    );
  }

  function deleteObj(
    obj: Transaction | Bill | Category,
    showToast: boolean = true
  ) {
    toast(CustomNotification, {
      closeButton: false,
      position: "bottom-center",
      autoClose: false,
      draggable: false,
      onClose(reason) {
        switch (reason) {
          case "delete":
            if ("date" in obj) {
              setTransactions((prevState) => {
                return getRecentTransactions(
                  prevState.filter((t) => t.id !== obj.id)
                );
              });
              if (showToast)
                toast.success(
                  (obj as Transaction).destiny + " was successfully deleted!"
                );
            } else if ("paymentDay" in obj) {
              setBills((prevState) => {
                return getNextBills(prevState.filter((b) => b.id !== obj.id));
              });
              if (showToast)
                toast.success(
                  (obj as Bill).destiny + " was successfully deleted!"
                );
            } else {
              setCategories((prevState) => {
                return prevState.filter((cat) => cat.id !== obj.id);
              });
              if (showToast)
                toast.success(
                  (obj as Category).name + " was successfully deleted!"
                );
            }
        }
      },
    });
  }

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
    addObj,
    updateObj,
    deleteObj,
  };

  return <DataContext.Provider value={values}>{children}</DataContext.Provider>;
}
