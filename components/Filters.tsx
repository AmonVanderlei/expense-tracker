import { AuthContext } from "@/contexts/authContext";
import { DataContext } from "@/contexts/dataContext";
import Bill from "@/types/Bill";
import Transaction from "@/types/Transaction";
import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import MultipleFilter from "./MultipleFilter";

interface Props {
  transactions: Transaction[];
  bills: Bill[];
  setFilteredTransactions: Dispatch<SetStateAction<Transaction[]>>;
  setFilteredBills: Dispatch<SetStateAction<Bill[]>>;
}

export default function Filters({
  transactions,
  bills,
  setFilteredTransactions,
  setFilteredBills,
}: Props) {
  const dataContext = useContext(DataContext);
  if (!dataContext) {
    throw new Error("DataContext must be used within a DataContextProvider");
  }
  const { categories, banks } = dataContext;
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("AuthContext must be used within a AuthContextProvider");
  }
  const { messages } = authContext;

  const [filters, setFilters] = useState({
    type: [] as string[],
    bank2bank: [] as string[],
    categoryId: [] as string[],
    bankId: [] as string[],
    paid: [] as string[],
  });

  useEffect(() => {
    const filteredTransactions = transactions.filter((t) => {
      const matchesType =
        filters.type.length === 0 ||
        filters.type.includes(String(t.type));
      const matchesBank2Bank =
        filters.bank2bank.length === 0 ||
        filters.bank2bank.includes(String(t.bank2bank));
      const matchesCategory =
        filters.categoryId.length === 0 ||
        filters.categoryId.includes(String(t.categoryId));
      const matchesBank =
        filters.bankId.length === 0 ||
        filters.bankId.includes(String(t.bankId));
      return matchesType && matchesBank2Bank && matchesCategory && matchesBank;
    });

    const filteredBills = bills.filter((b) => {
      const matchesType =
        filters.type.length === 0 ||
        filters.type.includes(String(b.type));
      const matchesBank2Bank =
        filters.bank2bank.length === 0 ||
        filters.bank2bank.includes(String(b.bank2bank));
      const matchesCategory =
        filters.categoryId.length === 0 ||
        filters.categoryId.includes(String(b.categoryId));
      const matchesBank =
        filters.bankId.length === 0 ||
        filters.bankId.includes(String(b.bankId));
        const matchesPaid =
        filters.paid.length === 0 ||
        filters.paid.includes(String(b.paid));
      return matchesType && matchesBank2Bank && matchesCategory && matchesBank && matchesPaid;
    });

    setFilteredTransactions(filteredTransactions);
    setFilteredBills(filteredBills);
  }, [filters, transactions, bills]);

  const updateFilters = (key: string, values: string[]) => {
    setFilters((prev) => ({ ...prev, [key]: values }));
  };

  return (
    <div className="w-11/12 flex justify-start items-center overflow-x-auto gap-2">
      {/* Income/Expense Filter */}
      <MultipleFilter
        title={`${messages.other.income}/${messages.other.expense}`}
        items={[
          { id: "income", name: messages.other.income },
          { id: "expense", name: messages.other.expense },
        ]}
        transactions={transactions}
        bills={bills}
        filterKey="type"
        updateFilters={updateFilters}
      />

      {/* Category Filter */}
      <MultipleFilter
        title={messages.other.category}
        items={categories}
        transactions={transactions}
        bills={bills}
        filterKey="categoryId"
        updateFilters={updateFilters}
      />

      {/* Bank Filter */}
      <MultipleFilter
        title={messages.other.bank}
        items={banks.map((b) => ({ id: b.id, name: b.bankName }))}
        transactions={transactions}
        bills={bills}
        filterKey="bankId"
        updateFilters={updateFilters}
      />

      {/* Bank2Bank Filter */}
      <MultipleFilter
        title={messages.form.bank2bank}
        items={[
          { id: "true", name: messages.other.yes },
          { id: "false", name: messages.other.no },
        ]}
        transactions={transactions}
        bills={bills}
        filterKey="bank2bank"
        updateFilters={updateFilters}
      />

      {/* Paid Filter */}
      <MultipleFilter
        title={messages.other.paid}
        items={[
          { id: "true", name: messages.other.yes },
          { id: "false", name: messages.other.no },
        ]}
        transactions={transactions}
        bills={bills}
        filterKey="paid"
        updateFilters={updateFilters}
      />
    </div>
  );
}
