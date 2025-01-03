export default interface Transaction {
  id: string;
  type: "income" | "expense";
  destiny: string;
  date: Date;
  amount: number;
  categoryId: string;
  uid: string;
}
