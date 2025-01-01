import Transaction from "@/types/Transaction";
import TransactionComponent from "@/components/TransactionComponent";
import Category from "@/types/Category";

interface Props {
  transactionsList: Transaction[] | null;
  categories: Category[];
}

export default function TransactionsComponent({
  categories,
  transactionsList,
}: Props) {
  return (
    <div className="flex flex-col items-center w-full gap-4">
      {transactionsList?.map((transaction: Transaction) => (
        <TransactionComponent
          obj={transaction}
          key={transaction.id}
          categories={categories}
        />
      ))}
    </div>
  );
}
