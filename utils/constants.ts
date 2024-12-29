import Category from "@/types/Category";
import Transaction from "@/types/Transaction";
import User from "@/types/User";

export const CATEGORIES: Category[] = [
  { id: 1, name: "Celular", color: "#0f0" },
  { id: 2, name: "Estudos", color: "#00f" },
];

export const TRANSACTIONS: Transaction[] = [
  {
    id: new Date().getTime(),
    type: "income",
    origin: "Bolsa",
    description: "Bolsa do NES",
    destiny: "Amon Vanderlei",
    date: new Date("2024-12-20"),
    amount: 500,
    method: "pix",
    categoryId: 2,
  },
  {
    id: new Date().getTime() + 1,
    type: "expense",
    origin: "Amon Vanderlei",
    destiny: "TIM",
    date: new Date("2024-12-12"),
    amount: 50,
    method: "pix",
    categoryId: 1,
  },
  {
    id: new Date().getTime() + 2,
    type: "income",
    origin: "Bolsa",
    description: "Bolsa do NES",
    destiny: "Amon Vanderlei",
    date: new Date("2024-12-20"),
    amount: 500,
    method: "pix",
    categoryId: 2,
  },
  {
    id: new Date().getTime() + 3,
    type: "expense",
    origin: "Amon Vanderlei",
    destiny: "TIM",
    date: new Date("2024-12-12"),
    amount: 50,
    method: "pix",
    categoryId: 1,
  },
  {
    id: new Date().getTime() + 4,
    type: "income",
    origin: "Bolsa",
    description: "Bolsa do NES",
    destiny: "Amon Vanderlei",
    date: new Date("2024-12-20"),
    amount: 500,
    method: "pix",
    categoryId: 2,
  },
  {
    id: new Date().getTime() + 5,
    type: "expense",
    origin: "Amon Vanderlei",
    destiny: "Empresa",
    date: new Date("2024-12-12"),
    amount: 50,
    method: "pix",
    categoryId: 2,
  },
];

export const USERS: User[] = [
  {
    id: 1,
    firstName: "Amon",
    lastName: "Vanderlei",
    email: "amon.chalegre@gmail.com",
    password: "12345",
    balance: 12834,
    monthlyBudget: 2500,
  },
];
