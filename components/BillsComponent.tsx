"use client";

import Category from "@/types/Category";
import Bill from "@/types/Bill";
import BillComponent from "./BillComponent";

interface Props {
  bills: Bill[] | null;
  categories: Category[];
}

export default function BillsComponent({ categories, bills }: Props) {
  return (
    <div className="flex flex-col items-center w-full gap-4">
      {bills?.map((bill: Bill) =>
        bill.paymentDay >= new Date().getDate() ? (
          <BillComponent obj={bill} key={bill.id} categories={categories} />
        ) : null
      )}
    </div>
  );
}
