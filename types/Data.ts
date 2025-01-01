export interface ExpensesPerCategory {
  id: number;
  color: string;
  label: string;
  value: number;
}

export interface MonthData {
  income: number;
  expenses: number;
  diff: number;
  monthStr: string;
  expensesPerCategory: ExpensesPerCategory[];
}

export interface YearData {
  year: number;
  data: MonthData[];
}
