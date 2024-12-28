export default interface Transaction {
  id: number;
  type: "income" | "expense";
  origin: string;
  destiny: string;
  description?: string;
  date: Date;
  amount: number;
  method: "cash" | "credit-card" | "debit-card" | "pix";
  categoryId: number;
}
