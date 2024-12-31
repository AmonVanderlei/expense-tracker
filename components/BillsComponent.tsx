"use client";

import Bill from "@/types/Bill";
import BillComponent from "./BillComponent";

interface Props {
  bills: Bill[] | null;
}

export default function BillsComponent({ bills }: Props) {
  return (
    <div className="flex flex-col items-center w-full gap-4">
      {bills?.map((bill: Bill) =>
        !bill.paid && bill.nextPayment.getTime() <= new Date().getTime() ? (
          <BillComponent obj={bill} key={bill.id} />
        ) : null
      )}
    </div>
  );
}
