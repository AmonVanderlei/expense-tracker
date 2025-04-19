import { AuthContext } from "@/contexts/authContext";
import { DataContext } from "@/contexts/dataContext";
import Bill from "@/types/Bill";
import Transaction from "@/types/Transaction";
import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

interface Props {
  transactions: Transaction[];
  bills: Bill[];
  setFilteredTransactions: Dispatch<SetStateAction<Transaction[]>>;
  setFilteredBills: Dispatch<SetStateAction<Bill[]>>;
}

// Filtros: bank2bank, bank, category, date, type, paid (bills)

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
  const { categories } = dataContext;
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("AuthContext must be used within a AuthContextProvider");
  }
  const { messages } = authContext;

  const [bank2bankFilter, setBank2bankFilter] = useState<{
    yes: boolean;
    no: boolean;
  }>({ yes: false, no: false });

  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const [showBank2BankDropdown, setShowBank2BankDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const bank2bankDropdownRef = useRef<HTMLDivElement>(null);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let filteredTransactions = [...transactions];
    let filteredBills = [...bills];

    if (bank2bankFilter.yes != bank2bankFilter.no) {
      if (bank2bankFilter.yes) {
        filteredTransactions = filteredTransactions.filter(
          (t) => t.bank2bank === true
        );
        filteredBills = filteredBills.filter((b) => b.bank2bank === true);
      } else {
        filteredTransactions = filteredTransactions.filter(
          (t) => t.bank2bank === false
        );
        filteredBills = filteredBills.filter((b) => b.bank2bank === false);
      }
    }

    if (categoryFilter.length > 0) {
      filteredTransactions = filteredTransactions.filter((t) =>
        categoryFilter.includes(t.categoryId)
      );
      filteredBills = filteredBills.filter((b) =>
        categoryFilter.includes(b.categoryId)
      );
    }

    setFilteredTransactions(filteredTransactions);
    setFilteredBills(filteredBills);
  }, [bank2bankFilter, categoryFilter, transactions]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        bank2bankDropdownRef.current &&
        !bank2bankDropdownRef.current.contains(event.target as Node)
      ) {
        setShowBank2BankDropdown(false);
      }
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(event.target as Node)
      ) {
        setShowCategoryDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const usedCategoryIds = Array.from(
    new Set(
      [...transactions, ...bills].map((item) => item.categoryId).filter(Boolean)
    )
  );

  const usedCategories = categories.filter((cat) =>
    usedCategoryIds.includes(cat.id)
  );

  const toggleCategory = (cat: string) => {
    setCategoryFilter((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  return (
    <div className="w-11/12 flex justify-start items-center overflow-x-auto gap-4">
      {/* Bank2Bank Filter */}
      <div ref={bank2bankDropdownRef}>
        <button
          onClick={() => setShowBank2BankDropdown((prev) => !prev)}
          className={`bg-white bg-opacity-10 text-white px-4 py-1 rounded-full text-sm hover:bg-opacity-20 transition-all ${
            bank2bankFilter.yes !== bank2bankFilter.no
              ? "border border-white bg-opacity-0"
              : ""
          }`}
        >
          {messages.form.bank2bank}
        </button>

        {showBank2BankDropdown && (
          <div className="absolute z-10 mt-2 bg-zinc-800 text-white rounded-xl shadow-lg p-3 flex gap-2">
            <button
              onClick={() =>
                setBank2bankFilter((prev) => ({ ...prev, yes: !prev.yes }))
              }
              className={`px-3 py-1 rounded-full text-sm transition-all duration-200 ${
                bank2bankFilter.yes ? "bg-green-600" : "bg-white bg-opacity-10"
              }`}
            >
              {messages.other.yes}
            </button>
            <button
              onClick={() =>
                setBank2bankFilter((prev) => ({ ...prev, no: !prev.no }))
              }
              className={`px-3 py-1 rounded-full text-sm transition-all duration-200 ${
                bank2bankFilter.no ? "bg-red-600" : "bg-white bg-opacity-10"
              }`}
            >
              {messages.other.no}
            </button>
          </div>
        )}
      </div>

      {/* Category Filter */}
      <div ref={categoryDropdownRef}>
        <button
          onClick={() => setShowCategoryDropdown((prev) => !prev)}
          className={`bg-white bg-opacity-10 text-white px-4 py-1 rounded-full text-sm hover:bg-opacity-20 transition-all ${
            categoryFilter.length > 0 ? "border border-white bg-opacity-0" : ""
          }`}
        >
          {messages.other.category}
        </button>

        {showCategoryDropdown && (
          <div className="absolute z-10 mt-2 bg-zinc-800 text-white rounded-xl shadow-lg p-3 flex flex-col gap-2 max-h-60 overflow-y-auto">
            {usedCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => toggleCategory(cat.id)}
                className={`px-3 py-1 rounded-full text-sm transition-all duration-200 text-left ${
                  categoryFilter.includes(cat.id)
                    ? "bg-blue-600"
                    : "bg-white bg-opacity-10"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
