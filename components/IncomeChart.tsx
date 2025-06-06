"use client";
import {
  ResponsiveChartContainer,
  BarPlot,
  LinePlot,
  ChartsXAxis,
  ChartsYAxis,
  ChartsGrid,
  ChartsTooltip,
  MarkPlot,
} from "@mui/x-charts";
import { YearData } from "@/types/Data";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/contexts/authContext";

interface Dataset {
  [key: string]: string | number | null | undefined;
  income: number;
  expenses: number;
  diff: number;
  monthStr: string;
}

interface Props {
  setYear: number;
  dataPerYear: YearData[];
}

export default function ExpensesChart({ setYear, dataPerYear }: Props) {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("AuthContext must be used within a AuthContextProvider");
  }
  const { messages } = authContext;

  const [dataset, setDataset] = useState<Dataset[]>([]);

  useEffect(() => {
    const dataYear = dataPerYear.find((obj) => obj.year === setYear);
    const data = dataYear?.data || [];

    const mappedDataset: Dataset[] = data.map((item) => {
      const { income, diff, monthStr } = item;
      let { expenses } = item;
      expenses = -expenses;
      return { income, expenses, diff, monthStr };
    });

    setDataset(mappedDataset);
  }, [dataPerYear, setYear]);

  return (
    <div
      className="w-11/12 bg-slate-900 rounded-lg py-4"
      onContextMenu={(e) => e.preventDefault()}
    >
      <h1 className="text-xl font-bold ml-4">
        {messages.other.income} {messages.other.and.toLowerCase()}{" "}
        {messages.other.expenses}
      </h1>
      <div className="w-full bg-slate-500 overflow-auto h-[26rem] sm:h-auto">
        <div className="w-[150vw] sm:w-full h-96 bg-slate-900">
          <ResponsiveChartContainer
            series={[
              {
                id: 1,
                type: "bar",
                dataKey: "income",
                label: "Income",
                color: "#068f06",
              },
              {
                id: 3,
                type: "bar",
                dataKey: "expenses",
                label: "Expenses",
                color: "#a10606",
              },
              {
                id: 2,
                type: "line",
                dataKey: "diff",
                color: "#bdc704",
                label: "Profit",
              },
            ]}
            xAxis={[
              {
                scaleType: "band",
                dataKey: "monthStr",
              },
            ]}
            dataset={dataset}
          >
            <ChartsGrid horizontal />
            <BarPlot />
            <LinePlot />
            <MarkPlot />

            <ChartsXAxis
              label="Month"
              labelStyle={{ fill: "#fff" }}
              tickLabelStyle={{ fill: "#fff" }}
            />
            <ChartsYAxis
              label="R$"
              labelStyle={{ fill: "#fff" }}
              tickLabelStyle={{ fill: "#fff" }}
            />
            <ChartsTooltip />
          </ResponsiveChartContainer>
        </div>
      </div>
    </div>
  );
}
