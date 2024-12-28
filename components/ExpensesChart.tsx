"use client";
import { PieChart } from "@mui/x-charts/PieChart";
import { styled } from "@mui/material";
import { useDrawingArea } from "@mui/x-charts";
import { formatCurrency } from "@/utils/formatCurrency";
import Category from "@/types/Category";
import Transaction from "@/types/Transaction";

interface Props {
  transactions: Transaction[];
  categories: Category[];
}

export default function ExpensesChart({ transactions, categories }: Props) {
  const StyledText = styled("text")(() => ({
    fill: "white",
    textAnchor: "middle",
    dominantBaseline: "central",
    fontSize: 20,
  }));

  function PieCenterLabel({ children }: { children: React.ReactNode }) {
    const { width, height, left, top } = useDrawingArea();
    return (
      <StyledText x={left + width / 2} y={top + height / 2}>
        {children}
      </StyledText>
    );
  }

  let expenses = 0;

  const expensesPerCategory = (
    categories: Category[],
    transactions: Transaction[]
  ) => {
    return categories.map((category) => {
      const totalSpent = transactions
        .filter(
          (transaction) =>
            transaction.categoryId === category.id &&
            transaction.type === "expense"
        )
        .reduce((sum, transaction) => sum + transaction.amount, 0);

      expenses += totalSpent;

      return {
        id: category.id,
        label: category.name,
        value: totalSpent,
      };
    });
  };

  return (
    <PieChart
      className="w-11/12 bg-slate-900 rounded-lg p-4"
      series={[
        {
          data: expensesPerCategory(categories, transactions),
          valueFormatter: (data) => {
            return `You spent ${formatCurrency(data.value)} with ${
              data.label
            }.`;
          },
          innerRadius: 85,
          outerRadius: 100,
          paddingAngle: 2,
          cornerRadius: 1,
        },
      ]}
      width={400}
      height={250}
      slotProps={{
        legend: {
          itemMarkWidth: 10,
          itemMarkHeight: 10,
          markGap: 5,
          itemGap: 10,
          labelStyle: {
            fontSize: 20,
            fill: "white",
          },
        },
      }}
    >
      <PieCenterLabel>{formatCurrency(expenses)}</PieCenterLabel>
    </PieChart>
  );
}