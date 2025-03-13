export default interface Transaction {
  id: string;
  type: "income" | "expense";
  destiny: string;
  date: Date;
  amount: number;
  categoryId: string;
  bankId: string;
  bank2bank: boolean;
  uid: string;
}
