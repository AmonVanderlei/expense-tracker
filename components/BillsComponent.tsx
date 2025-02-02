import Bill from "@/types/Bill";
import BillComponent from "./BillComponent";
import { Dispatch, SetStateAction } from "react";
import Transaction from "@/types/Transaction";

interface Props {
  bills: Bill[];
  setSelectedObj: Dispatch<SetStateAction<Transaction | Bill | null>>;
  openModal: Dispatch<SetStateAction<boolean>>;
}

export default function BillsComponent({
  bills,
  setSelectedObj,
  openModal,
}: Props) {
  const unpaidBills = bills.filter((bill) => !bill.paid);
  const paidBills = bills.filter((bill) => bill.paid);
  return (
    <div className="flex flex-col items-center w-full gap-4">
      {unpaidBills.length > 0 &&
        unpaidBills.map((bill: Bill) => (
          <BillComponent
            obj={bill}
            key={bill.id}
            setSelectedObj={setSelectedObj}
            openModal={openModal}
          />
        ))}

      {paidBills.length > 0 &&
        paidBills.map((bill: Bill) => (
          <BillComponent
            obj={bill}
            key={bill.id}
            setSelectedObj={setSelectedObj}
            openModal={openModal}
          />
        ))}
    </div>
  );
}
