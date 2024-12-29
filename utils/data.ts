import Transaction from "@/types/Transaction";

export function getDataPerMonth(transactions: Transaction[]) {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Mai",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const data = months.map((month, index) => {
    const monthlyTransactions = transactions.filter(
      (t: Transaction) => t.date.getMonth() === index
    );

    const income = monthlyTransactions
      .filter((t: Transaction) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = monthlyTransactions
      .filter((t: Transaction) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const diff = income - expenses;

    return {
      income,
      expenses,
      diff,
      month,
    };
  });
  return data;
}
