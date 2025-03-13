"use client";
import { PieChart } from "@mui/x-charts/PieChart";
import { styled } from "@mui/material";
import { useDrawingArea } from "@mui/x-charts";
import { formatCurrency } from "@/utils/formatCurrency";
import { useContext, useEffect, useState } from "react";
import { ExpensesPerCategory, YearData } from "@/types/Data";
import { AuthContext } from "@/contexts/authContext";

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
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("AuthContext must be used within a AuthContextProvider");
  }
  const { messages } = authContext;

  const [expenses, setExpenses] = useState<number>(0);
  const [expensesPerCategory, setExpensesPerCategory] = useState<
    { id: string; color: string; label: string; value: number }[]
  >([]);

  useEffect(() => {
    const yearObj = dataPerYear.find((obj) => obj.year === setYear);
    const data = yearObj?.data || [];
    const monthObj = data.find((obj) => obj.monthStr === setMonth);
    if (monthObj) {
      setExpenses(monthObj.expenses);
      const filteredObj = monthObj.expensesPerCategory.filter(
        (cat) => cat.value !== 0
      );
      const dataset = filteredObj.map((cat) => {
        return {
          id: cat.category.id,
          color: cat.category.color,
          label: cat.category.name,
          value: cat.value,
        };
      });
      setExpensesPerCategory(dataset);
    }
  }, [dataPerYear, setMonth, setYear]);

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
    <div
      className="w-11/12 bg-slate-900 rounded-lg p-4"
      onContextMenu={(e) => e.preventDefault()}
    >
      <h1 className="text-xl font-bold">
        {messages.other.expenses} - {setMonth} {setYear}
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
          height={400}
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
              direction: "column",
              position: { vertical: "top", horizontal: "right" },
              padding: 0,
            },
          }}
        >
          <PieCenterLabel>{formatCurrency(expenses)}</PieCenterLabel>
        </PieChart>
      </div>
    </div>
  );
}
