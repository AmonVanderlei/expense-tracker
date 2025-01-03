export default interface Bill {
  id: string;
  type: "income" | "expense";
  paid: boolean;
  destiny: string;
  paymentDay: number;
  nextPayment: Date;
  amount: number;
  categoryId: string;
  uid: string;
}
