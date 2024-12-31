export default interface Transaction {
  id: number;
  type: "income" | "expense";
  origin: string;
  destiny: string;
  date: Date;
  amount: number;
  categoryId: number;
}
