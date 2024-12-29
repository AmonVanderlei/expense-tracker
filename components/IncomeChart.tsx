"use client";
import Category from "@/types/Category";
import Transaction from "@/types/Transaction";
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
import { getDataPerYear } from "@/utils/data";

interface Props {
  transactions: Transaction[];
  categories: Category[];
  setYear: number;
}

export default function IncomeChart({
  transactions,
  categories,
  setYear,
}: Props) {
  const { data } = getDataPerYear(transactions, categories).filter(
    (obj) => obj.year === setYear
  )[0];

  const dataset = data.map((item) => {
    let { income, expenses, diff, month } = item;
    expenses = -expenses;
    return { income, expenses, diff, month };
  });

  return (
    <div className="w-11/12 bg-slate-900 rounded-lg py-4">
      <h1 className="text-xl font-bold ml-4">Income and Expenses</h1>
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
                dataKey: "month",
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
