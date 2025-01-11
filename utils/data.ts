import Bill from "@/types/Bill";
import Category from "@/types/Category";
import { ExpensesPerCategory, MonthData, YearData } from "@/types/Data";
import Transaction from "@/types/Transaction";
import {
  addDoc,
  collection,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/utils/firebase/index";
import Budget from "@/types/Budget";

export async function addDocument(
  col: string,
  obj: Transaction | Bill | Category | Budget
) {
  try {
    const { id, ...objWithoutId } = obj;
    const collectionRef = collection(db, col);
    const docRef = await addDoc(collectionRef, objWithoutId);

    return docRef.id;
  } catch (e) {
    throw e;
  }
}

export async function updateDocument(
  col: string,
  obj: Transaction | Bill | Category | Budget
) {
  try {
    const docRef = doc(db, col, obj.id);

    await updateDoc(docRef, { ...obj });

    return docRef.id;
  } catch (e) {
    throw e;
  }
}

export async function deleteDocument(col: string, objId: string) {
  try {
    const docRef = doc(db, col, objId);
    await deleteDoc(docRef);
  } catch (e) {
    throw e;
  }
}

export async function getDocuments(
  col: string,
  uid: string
): Promise<Transaction[] | Bill[] | Category[] | Budget[]> {
  try {
    const collectionRef = collection(db, col);
    const q = query(collectionRef, where("uid", "==", uid));

    const docsSnap = await getDocs(q);

    if (col === "transactions") {
      return docsSnap.docs.map((doc) => {
        return {
          id: doc.id,
          type: doc.data().type as string,
          destiny: doc.data().destiny as string,
          date: new Date(doc.data().date.toMillis()),
          amount: +doc.data().amount,
          categoryId: doc.data().categoryId,
        } as Transaction;
      });
    } else if (col == "bills") {
      return docsSnap.docs.map((doc) => {
        return {
          id: doc.id,
          type: doc.data().type as string,
          paid: doc.data().paid as boolean,
          destiny: doc.data().destiny as string,
          paymentDay: +doc.data().paymentDay,
          nextPayment: new Date(doc.data().nextPayment.toMillis()),
          amount: +doc.data().amount,
          categoryId: doc.data().categoryId,
        } as Bill;
      });
    } else if (col == "budgets") {
      return docsSnap.docs.map((doc) => {
        return {
          id: doc.id,
          bdgt: doc.data().bdgt,
        } as Budget;
      });
    } else {
      return docsSnap.docs.map((doc) => {
        return {
          id: doc.id,
          color: doc.data().color as string,
          name: doc.data().name as string,
        } as Category;
      });
    }
  } catch (e) {
    return [];
  }
}

export function getDataPerYear(
  transactions: Transaction[],
  categories: Category[]
): YearData[] {
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

  const years = Array.from(
    new Set(transactions.map((t) => t.date.getFullYear()))
  );

  const dataByYear = years.map((year) => {
    const data: MonthData[] = months.map((monthStr, index) => {
      const monthlyTransactions: Transaction[] = transactions.filter(
        (t: Transaction) =>
          t.date.getMonth() === index && t.date.getFullYear() === year
      );

      const income: number = monthlyTransactions
        .filter((t: Transaction) => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);

      const expenses: number = monthlyTransactions
        .filter((t: Transaction) => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);

      const diff: number = income - expenses;

      const expensesPerCategory: ExpensesPerCategory[] = categories.map(
        (category) => {
          const totalSpent = monthlyTransactions
            .filter(
              (transaction) =>
                transaction.categoryId === category.id &&
                transaction.type === "expense"
            )
            .reduce((sum, transaction) => sum + transaction.amount, 0);

          return {
            id: category.id,
            color: category.color,
            label: category.name,
            value: totalSpent,
          };
        }
      );

      return {
        income,
        expenses,
        diff,
        monthStr,
        expensesPerCategory,
      } as MonthData;
    });

    return {
      year,
      data,
    };
  });

  return dataByYear;
}

export function getDataPerMonth(
  transactions: Transaction[],
  categories: Category[],
  year: number,
  month: number
): MonthData {
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

  const monthlyTransactions = transactions.filter(
    (t: Transaction) =>
      t.date.getMonth() === month && t.date.getFullYear() === year
  );

  const income = monthlyTransactions
    .filter((t: Transaction) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const expenses = monthlyTransactions
    .filter((t: Transaction) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const diff = income - expenses;

  const monthStr = months[month];

  const expensesPerCategory = categories.map((category) => {
    const totalSpent = monthlyTransactions
      .filter(
        (transaction) =>
          transaction.categoryId === category.id &&
          transaction.type === "expense"
      )
      .reduce((sum, transaction) => sum + transaction.amount, 0);

    return {
      id: category.id,
      color: category.color,
      label: category.name,
      value: totalSpent,
    };
  });

  return {
    income,
    expenses,
    diff,
    monthStr,
    expensesPerCategory,
  };
}

export function getRecentTransactions(
  transactions: Transaction[],
  limit?: number
): Transaction[] {
  const sortedTransactions = transactions.sort(
    (a, b) => b.date.getTime() - a.date.getTime()
  );
  return limit ? sortedTransactions.slice(0, limit) : sortedTransactions;
}

export function getNextBills(
  bills: Bill[],
  filter: boolean = true,
  limit?: number
): Bill[] {
  if (filter) {
    const validBills = bills.filter((bill) => {
      return !bill.paid && bill.nextPayment.getTime() <= new Date().getTime();
    });
    const sortedTransactions = validBills.sort(
      (a, b) => a.paymentDay - b.paymentDay
    );
    return limit ? sortedTransactions.slice(0, limit) : sortedTransactions;
  } else {
    const sortedTransactions = bills.sort(
      (a, b) => a.paymentDay - b.paymentDay
    );
    return limit ? sortedTransactions.slice(0, limit) : sortedTransactions;
  }
}

export function getBalance(transactions: Transaction[]): number {
  const income = transactions
    .filter((t: Transaction) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const expenses = transactions
    .filter((t: Transaction) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = income - expenses;

  return balance;
}
