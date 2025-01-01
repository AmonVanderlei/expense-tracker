"use client";

import Bill from "@/types/Bill";
import BillComponent from "./BillComponent";

interface Props {
  bills: Bill[];
}

export default function BillsComponent({ bills }: Props) {
  return (
    <div className="flex flex-col items-center w-full gap-4">
      {bills?.length > 0 ? (
        bills?.map((bill: Bill) => <BillComponent obj={bill} key={bill.id} />)
      ) : (
        <p className="text-center text-lg text-blue-500">
          There are not bills to pay or salaries to receive anymore!
        </p>
      )}
    </div>
  );
}
