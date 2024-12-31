export default interface Bill {
  id: number;
  type: "expense" | "salary";
  paid: boolean;
  destiny: string;
  paymentDay: number;
  nextPayment: Date;
  amount: number;
  categoryId: number;
}
