"use client";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  getBalance,
  getDataPerMonth,
  getRecentTransactions,
  getDataPerYear,
  getNextBills,
  addDocument,
  getDocuments,
  deleteDocument,
  updateDocument,
} from "@/utils/data";
import { YearData, MonthData } from "@/types/Data";
import Transaction from "@/types/Transaction";
import Bill from "@/types/Bill";
import Category from "@/types/Category";
import { toast, ToastContentProps } from "react-toastify";
import { AuthContext } from "./authContext";
import Budget from "@/types/Budget";

export interface DataContextType {
  balance: number;
  budget: Budget;
  showTransactionOrBill: string;
  setShowTransactionOrBill: Dispatch<SetStateAction<string>>;
  transactions: Transaction[];
  recentTransactions: Transaction[];
  bills: Bill[];
  nextBills: Bill[];
  categories: Category[];
  dataCurrentMonth: MonthData;
  dataPerYear: YearData[];
  addObj: (obj: Transaction | Bill | Category | Budget) => void;
  updateObj: (obj: Transaction | Bill | Category | Budget) => void;
  deleteObj: (obj: Transaction | Bill | Category) => void;
}

export const DataContext = createContext<DataContextType | null>(null);

interface Props {
  children: React.ReactNode;
}

export default function DataContextProvider({ children }: Props) {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("AuthContext must be used within a AuthContextProvider");
  }
  const { user, messages } = authContext;

  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>(
    []
  );
  const [bills, setBills] = useState<Bill[]>([]);
  const [nextBills, setNextBills] = useState<Bill[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [budget, setBudget] = useState<Budget>({
    id: "",
    bdgt: 0,
    uid: user?.uid as string | "",
  });
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
    if (!user) return;

    const fetchData = async () => {
      try {
        const transactionsData = await getDocuments("transactions", user.uid);
        const billsData = await getDocuments("bills", user.uid);
        const categoriesData = await getDocuments("categories", user.uid);

        setTransactions(
          getRecentTransactions(transactionsData as Transaction[])
        );
        setBills(getNextBills(billsData as Bill[]));
        setCategories(categoriesData as Category[]);

        if (budget.id == "") {
          const budgetsData = await getDocuments("budgets", user.uid);
          setBudget(budgetsData[0] as Budget);
        }
      } catch (error) {
        toast.error(messages.error.firebase + error);
      }
    };

    fetchData();
  }, [user]);

  useEffect(() => {
    const updateData = async () => {
      try {
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
      } catch (error) {
        toast.error(messages.error.update + error);
      }
    };

    updateData();
  }, [transactions, bills, categories]);

  async function addObj(obj: Transaction | Bill | Category | Budget) {
    const { id, ...objWithoutId } = obj;
    if ("date" in obj) {
      // Add to firebase
      const newId = await toast.promise(addDocument("transactions", obj), {
        pending: messages.loading.add,
        success: messages.success.add,
        error: messages.error.something,
      });

      // Add locally
      setTransactions((prevState) => {
        return getRecentTransactions([
          ...prevState,
          { id: newId, ...objWithoutId } as Transaction,
        ]) as Transaction[];
      });
    } else if ("paymentDay" in obj) {
      // Add to firebase
      const newId = await toast.promise(addDocument("bills", obj), {
        pending: messages.loading.add,
        success: messages.success.add,
        error: messages.error.something,
      });

      // Add locally
      setBills((prevState) => {
        return getNextBills([
          ...prevState,
          { id: newId, ...objWithoutId } as Bill,
        ]);
      });
    } else if ("bdgt" in obj) {
      // Add to firebase
      const newId = await toast.promise(addDocument("budgets", obj), {
        pending: messages.loading.add,
        success: messages.success.add,
        error: messages.error.something,
      });

      // Add locally
      setBudget({
        id: newId,
        bdgt: obj.bdgt,
        uid: user?.uid as string,
      });
    } else {
      // Add to firebase
      const newId = await toast.promise(addDocument("categories", obj), {
        pending: messages.loading.add,
        success: messages.success.add,
        error: messages.error.something,
      });

      // Add locally
      setCategories((prevState) => {
        return [...prevState, { id: newId, ...objWithoutId } as Category];
      });
    }
  }

  function updateObj(obj: Transaction | Bill | Category | Budget) {
    if ("date" in obj) {
      // Update on firebase
      toast.promise(updateDocument("transactions", obj), {
        pending: messages.loading.update,
        success: messages.success.update,
        error: messages.error.something,
      });

      // Update locally
      setTransactions((prevState) => {
        const updatedTransactions = prevState.map((t) =>
          t.id === obj.id ? { ...t, ...obj } : t
        );
        return getRecentTransactions(updatedTransactions);
      });
    } else if ("paymentDay" in obj) {
      // Update on firebase
      toast.promise(updateDocument("bills", obj), {
        pending: messages.loading.update,
        success: messages.success.update,
        error: messages.error.something,
      });

      // Update locally
      setBills((prevState) => {
        const updatedBills = prevState.map((b) =>
          b.id === obj.id ? { ...b, ...obj } : b
        );
        return getNextBills(updatedBills);
      });
    } else if ("bdgt" in obj) {
      // Update on firebase
      toast.promise(updateDocument("budgets", obj), {
        pending: messages.loading.update,
        success: messages.success.update,
        error: messages.error.something,
      });

      // Update locally
      setBudget(obj);
    } else {
      setCategories((prevState) => {
        // Update on firebase
        toast.promise(updateDocument("categories", obj), {
          pending: messages.loading.update,
          success: messages.success.update,
          error: messages.error.something,
        });

        // Update locally
        const updatedCategories = prevState.map((c) =>
          c.id === obj.id ? { ...c, ...obj } : c
        );
        return updatedCategories;
      });
    }
  }

  function CustomNotification({ closeToast }: ToastContentProps) {
    return (
      <div className="flex flex-col gap-2 w-full">
        {messages.button.confirmation}
        <div className="flex w-full gap-2">
          <button
            className="font-bold rounded-lg bg-slate-500 p-2 text-center w-1/2"
            onClick={closeToast}
          >
            {messages.button.cancel}
          </button>
          <button
            className="font-bold rounded-lg bg-red-500 p-2 text-center w-1/2"
            onClick={() => closeToast("delete")}
          >
            {messages.button.delete}
          </button>
        </div>
      </div>
    );
  }

  function deleteObj(obj: Transaction | Bill | Category) {
    toast(CustomNotification, {
      closeButton: false,
      position: "bottom-center",
      autoClose: false,
      draggable: false,
      onClose(reason) {
        switch (reason) {
          case "delete":
            if ("date" in obj) {
              // Delete on firebase
              toast.promise(deleteDocument("transactions", obj.id), {
                pending: messages.loading.delete,
                success: messages.success.delete,
                error: messages.error.something,
              });

              // Delete locally
              setTransactions((prevState) => {
                return getRecentTransactions(
                  prevState.filter((t) => t.id !== obj.id)
                );
              });
            } else if ("paymentDay" in obj) {
              // Delete on firebase
              toast.promise(deleteDocument("bills", obj.id), {
                pending: messages.loading.delete,
                success: messages.success.delete,
                error: messages.error.something,
              });

              // Delete locally
              setBills((prevState) => {
                return getNextBills(prevState.filter((b) => b.id !== obj.id));
              });
            } else {
              // Delete on firebase
              toast.promise(deleteDocument("categories", obj.id), {
                pending: messages.loading.delete,
                success: messages.success.delete,
                error: messages.error.something,
              });

              // Delete locally
              setCategories((prevState) => {
                return prevState.filter((cat) => cat.id !== obj.id);
              });
            }
        }
      },
    });
  }

  const values: DataContextType = {
    balance,
    budget,
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
