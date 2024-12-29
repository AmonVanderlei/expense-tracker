"use client";
import { PieChart } from "@mui/x-charts/PieChart";
import { styled } from "@mui/material";
import { useDrawingArea } from "@mui/x-charts";
import { formatCurrency } from "@/utils/formatCurrency";
import Category from "@/types/Category";
import Transaction from "@/types/Transaction";
import { getDataPerYear } from "@/utils/data";

interface Props {
  transactions: Transaction[];
  categories: Category[];
  setMonth: string;
  setYear: number;
}

export default function ExpensesChart({
  transactions,
  categories,
  setMonth,
  setYear,
}: Props) {
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

  const { year, data } = getDataPerYear(
    transactions,
    categories,
  ).filter((obj) => obj.year === setYear)[0];

  const { month, expenses, expensesPerCategory } = data.filter((obj) => obj.month === setMonth)[0];

  return (
    <div className="w-11/12 bg-slate-900 rounded-lg p-4">
      <h1 className="text-xl font-bold">Expenses - {month} {year}</h1>
      <div className="flex items-center">
        <PieChart
          className="w-full"
          series={[
            {
              data: expensesPerCategory,
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
      </div>
    </div>
  );
}
