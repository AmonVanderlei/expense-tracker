import Bill from "@/types/Bill";
import Transaction from "@/types/Transaction";
import { useEffect, useRef, useState } from "react";
import { BsTrash3 } from "react-icons/bs";

interface FilterItem {
  id: string;
  name: string;
}

interface Props {
  title: string;
  items: FilterItem[];
  transactions: Transaction[];
  bills: Bill[];
  filterKey: keyof Transaction | keyof Bill;
  updateFilters: (key: string, values: string[]) => void;
}

export default function MultipleFilter({
  title,
  items,
  transactions,
  bills,
  filterKey,
  updateFilters,
}: Props) {
  const [selected, setSelected] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    updateFilters(filterKey as string, selected);
  }, [selected]);

  const usedIds = Array.from(
    new Set(
      [...transactions, ...bills]
        .map((item) => String(item[filterKey as keyof typeof item]))
        .filter(Boolean)
    )
  );

  const usedItems = items.filter((item) => usedIds.includes(item.id));

  const toggleItem = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div ref={dropdownRef}>
      <div
        className={`flex bg-white bg-opacity-10 px-4 py-1 rounded-full hover:bg-opacity-20 transition-all items-center gap-2 ${
          selected.length > 0 ? "border border-white bg-opacity-0" : ""
        }`}
      >
        <p
          onClick={() => setShowDropdown((prev) => !prev)}
          className="text-white text-sm whitespace-nowrap"
        >
          {title}
        </p>
        {selected.length > 0 && (
          <button
            onClick={() => {
              setSelected([]);
              setShowDropdown(false);
            }}
            className="text-red-500 hover:text-red-400"
          >
            <BsTrash3 className="text-base" />
          </button>
        )}
      </div>

      {showDropdown && (
        <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 z-10 bg-slate-800 text-white rounded-xl p-3 flex flex-col gap-2 max-h-60 overflow-y-auto min-w-64">
          <div className="flex w-full justify-between"><h1 className="text-lg font-bold">{title}</h1>{selected.length > 0 && (
          <button
            onClick={() => {
              setSelected([]);
              setShowDropdown(false);
            }}
            className="text-red-500 hover:text-red-400"
          >
            <BsTrash3 className="text-base" />
          </button>
        )}</div>
          {usedItems.map((item) => (
            <button
              key={item.id}
              onClick={() => toggleItem(item.id)}
              className={`px-3 py-1 rounded-full text-sm transition-all duration-200 text-left ${
                selected.includes(item.id)
                  ? "bg-blue-600"
                  : "bg-white bg-opacity-10"
              }`}
            >
              {item.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
