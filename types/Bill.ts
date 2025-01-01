export default interface Bill {
  id: number;
  type: "income" | "expense";
  paid: boolean;
  destiny: string;
  paymentDay: number;
  nextPayment: Date;
  amount: number;
  categoryId: number;
}
