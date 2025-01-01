export default interface Transaction {
  id: number;
  type: "income" | "expense";
  destiny: string;
  date: Date;
  amount: number;
  categoryId: number;
}
