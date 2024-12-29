import Category from "@/types/Category";
import Transaction from "@/types/Transaction";

export function getDataPerYear(
  transactions: Transaction[],
  categories: Category[]
) {
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
    const data = months.map((month, index) => {
      const monthlyTransactions = transactions.filter(
        (t: Transaction) =>
          t.date.getMonth() === index && t.date.getFullYear() === year
      );

      const income = monthlyTransactions
        .filter((t: Transaction) => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);

      const expenses = monthlyTransactions
        .filter((t: Transaction) => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);

      const diff = income - expenses;

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
        month,
        expensesPerCategory,
      };
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
) {
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

  const data = months.map((month, index) => {
    const monthlyTransactions = transactions.filter(
      (t: Transaction) =>
        t.date.getMonth() === index && t.date.getFullYear() === year
    );

    const income = monthlyTransactions
      .filter((t: Transaction) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = monthlyTransactions
      .filter((t: Transaction) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const diff = income - expenses;

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
      month,
      expensesPerCategory,
    };
  });
  return data;
}
