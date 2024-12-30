"use client";
import Bill from "@/types/Bill";
import Category from "@/types/Category";

interface Props {
  obj: Bill;
  categories: Category[];
}

export default function BillComponent({ categories, obj }: Props) {
  const category = categories.find((cat) => cat.id === obj.categoryId);
  return (
    <div className="flex flex-col items-center w-full gap-2">
      <div className="flex justify-between items-center w-full">
        <div>
          <h1 className="text-lg font-semibold">{obj.destiny}</h1>
          <p className="text-sm">Payment Day: {obj.paymentDay}</p>
        </div>
        <p>{category ? category.name : "Sem Categoria"}</p>
        <button className="bg-red-500 bg-opacity-75 py-2 px-4 rounded-lg">
          Pay
        </button>
      </div>
    </div>
  );
}
