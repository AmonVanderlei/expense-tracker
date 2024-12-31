"use client";
import { PieChart } from "@mui/x-charts/PieChart";
import { styled } from "@mui/material";
import { useDrawingArea } from "@mui/x-charts";
import { formatCurrency } from "@/utils/formatCurrency";
import { useEffect, useState } from "react";
import { ExpensesPerCategory, YearData } from "@/types/Data";

interface Props {
  setMonth: string;
  setYear: number;
  dataPerYear: YearData[];
}

export default function ExpensesChart({
  setMonth,
  setYear,
  dataPerYear,
}: Props) {
  const [expenses, setExpenses] = useState<number>(0);
  const [expensesPerCategory, setExpensesPerCategory] = useState<
    ExpensesPerCategory[]
  >([]);

  useEffect(() => {
    const yearObj = dataPerYear.filter((obj) => obj.year === setYear)[0];
    const data = yearObj?.data || [];
    const monthObj = data.filter((obj) => obj.monthStr === setMonth)[0];
    if (monthObj) {
      setExpenses(monthObj.expenses);
      setExpensesPerCategory(monthObj.expensesPerCategory);
    }
  }, [dataPerYear]);

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

  return (
    <div className="w-11/12 bg-slate-900 rounded-lg p-4">
      <h1 className="text-xl font-bold">
        Expenses - {setMonth} {setYear}
      </h1>
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
