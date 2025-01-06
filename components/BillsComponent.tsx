import Bill from "@/types/Bill";
import BillComponent from "./BillComponent";
import { Dispatch, SetStateAction, useContext } from "react";
import Transaction from "@/types/Transaction";
import { AuthContext } from "@/contexts/authContext";

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
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("AuthContext must be used within a AuthContextProvider");
  }
  const { messages } = authContext;
  return (
    <div className="flex flex-col items-center w-full gap-4">
      {bills?.length > 0 ? (
        bills?.map((bill: Bill) => (
          <BillComponent
            obj={bill}
            key={bill.id}
            setSelectedObj={setSelectedObj}
            openModal={openModal}
          />
        ))
      ) : (
        <p className="text-center text-lg text-blue-500">
          {messages.other.noBills}
        </p>
      )}
    </div>
  );
}
