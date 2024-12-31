import Bill from "@/types/Bill";
import Category from "@/types/Category";
import { ExpensesPerCategory, MonthData, YearData } from "@/types/Data";
import Transaction from "@/types/Transaction";
import User from "@/types/User";

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

export function getUser(users: User[]): User {
  const currentUser = users.filter(
    (u: User) => u.email === "amon.chalegre@gmail.com" && u.password === "12345"
  )[0];
  return currentUser;
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

export function getNextBills(bills: Bill[], limit?: number): Bill[] {
  const sortedTransactions = bills.sort((a, b) => a.paymentDay - b.paymentDay);
  return limit ? sortedTransactions.slice(0, limit) : sortedTransactions;
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
