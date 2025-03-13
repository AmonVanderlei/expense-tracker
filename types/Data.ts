import Bank from "./Bank";
import Category from "./Category";

export interface Balance {
  totalBalance: number;
  [bankName: string]: number | undefined;
}

export interface ExpensesPerCategory {
  category: Category;
  value: number;
}

export interface DataPerBank {
  bank: Bank;
  income: number;
  expenses: number;
  diff: number;
}

export interface MonthData {
  income: number;
  expenses: number;
  diff: number;
  monthStr: string;
  expensesPerCategory: ExpensesPerCategory[];
  dataPerBank: DataPerBank[];
}

export interface YearData {
  year: number;
  data: MonthData[];
}
