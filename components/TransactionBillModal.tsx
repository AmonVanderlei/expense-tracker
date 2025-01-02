import { useRef, useState, useContext, Dispatch, SetStateAction } from "react";
import Modal from "@/components/ModalComponent";
import { DataContext } from "@/contexts/dataContext";
import Transaction from "@/types/Transaction";
import Bill from "@/types/Bill";
import clsx from "clsx";
import { formatCurrency } from "@/utils/formatCurrency";
import { toast } from "react-toastify";

interface Props {
  show: boolean;
  onClose: Dispatch<SetStateAction<boolean>>;
  selectedObj: Transaction | Bill | null;
  setSelectedObj: Dispatch<SetStateAction<Transaction | Bill | null>>;
}

export default function TransactionBillModal({
  show,
  onClose,
  selectedObj,
  setSelectedObj,
}: Props) {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("DataContext must be used within a DataContextProvider");
  }
  const { categories, updateObj, deleteObj } = context;

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [type, setType] = useState<"income" | "expense">("income");
  const [categoryId, setCategoryId] = useState<string>(
    selectedObj?.categoryId.toString() || ""
  );

  const nameRef = useRef<HTMLInputElement | null>(null);
  const amountRef = useRef<HTMLInputElement | null>(null);
  const paymentDayRef = useRef<HTMLInputElement | null>(null);

  if (!selectedObj) return null;

  const isTransaction = (obj: Transaction | Bill): obj is Transaction => {
    return (obj as Transaction).date !== undefined;
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const name = nameRef.current?.value.trim();
    const amount = amountRef.current?.value.trim();

    if (!name || !amount || !type || !categoryId) {
      toast.warning("Please fill out all fields.");
      return;
    }

    if (isTransaction(selectedObj)) {
      const updatedTransaction: Transaction = {
        ...selectedObj,
        type,
        destiny: name,
        amount: +amount,
        categoryId: categoryId,
      };

      updateObj(updatedTransaction);
    } else {
      const paymentDay = paymentDayRef.current?.value.trim();
      if (!paymentDay) {
        toast.warning("Please provide a payment day.");
        return;
      }

      const updatedBill: Bill = {
        ...selectedObj,
        type,
        destiny: name,
        amount: +amount,
        paymentDay: +paymentDay,
        categoryId: categoryId,
      };

      updateObj(updatedBill);
    }

    setIsEditing(false);
    setSelectedObj(null);
    onClose(false);
  };

  const handleDelete = (obj: Transaction | Bill) => {
    deleteObj(obj);

    setSelectedObj(null);
    onClose(false);
  };

  return (
    <Modal
      show={show}
      onClose={onClose}
      setSelectedObj={setSelectedObj}
      setIsEditing={setIsEditing}
    >
      <div className="flex flex-col">
        <h2 className="text-xl font-bold text-center">
          {isEditing ? "Edit " : ""}
          {isTransaction(selectedObj) ? "Transaction" : "Bill"}
          {isEditing ? " " : " Details"}
        </h2>

        {!isEditing ? (
          <div className="flex flex-col gap-5">
            <p
              className={clsx(
                "capitalize text-center",
                selectedObj.type === "income"
                  ? "text-green-500"
                  : "text-red-500"
              )}
            >
              {selectedObj.type}
            </p>
            <div className="flex justify-between items-center mt-10">
              <strong>{selectedObj.type === "income" ? "From" : "To"}:</strong>
              <p>{selectedObj.destiny}</p>
            </div>
            <div className="flex justify-between items-center">
              <strong>Amount:</strong>
              <p>{formatCurrency(selectedObj.amount)}</p>
            </div>
            {isTransaction(selectedObj) ? (
              <div className="flex justify-between items-center">
                <strong>Date:</strong>
                <p>{selectedObj.date.toLocaleDateString()}</p>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <strong>Payment Day:</strong>
                <p>{selectedObj.paymentDay}</p>
              </div>
            )}
            <div className="flex flex-col gap-2 mt-5">
              <button
                className="w-full font-bold rounded-lg bg-blue-500 p-2 text-center"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </button>
              <button
                className="w-full font-bold rounded-lg bg-red-500 p-2 text-center"
                onClick={() => handleDelete(selectedObj)}
              >
                Delete
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSave} className="flex flex-col gap-4 mt-4">
            <select
              name="selectType"
              className="text-slate-800 rounded-md p-2 w-full"
              onChange={(e) => setType(e.target.value as "income" | "expense")}
              defaultValue={selectedObj.type}
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>

            <div className="flex flex-col gap-1">
              <label className="font-bold text-sm" htmlFor="name">
                {selectedObj.type === "income"
                  ? "Payment sender"
                  : "Payment receiver"}
              </label>
              <input
                type="text"
                name="name"
                className="p-2 rounded-xl bg-slate-700 border"
                ref={nameRef}
                defaultValue={selectedObj.destiny}
                placeholder="Type here"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-bold text-sm" htmlFor="amount">
                Amount
              </label>
              <input
                type="number"
                name="amount"
                className="p-2 rounded-xl bg-slate-700 border"
                ref={amountRef}
                defaultValue={selectedObj.amount}
                placeholder="Enter amount"
                required
              />
            </div>

            {!isTransaction(selectedObj) && (
              <div className="flex flex-col gap-1">
                <label className="font-bold text-sm" htmlFor="paymentDay">
                  Payment Day
                </label>
                <input
                  type="number"
                  name="paymentDay"
                  className="p-2 rounded-xl bg-slate-700 border"
                  ref={paymentDayRef}
                  defaultValue={selectedObj.paymentDay}
                  placeholder="Enter payment day"
                  required
                />
              </div>
            )}

            <div className="flex flex-col gap-1">
              <label className="font-bold text-sm" htmlFor="category">
                Select category
              </label>
              <select
                name="category"
                className="text-slate-800 rounded-md p-2 w-full"
                onChange={(e) => setCategoryId(e.target.value)}
                defaultValue={selectedObj.categoryId || ""}
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="w-2/3 font-bold rounded-lg bg-green-500 p-2 text-center"
              >
                Save Changes
              </button>
              <button
                type="button"
                className="w-1/3 font-bold rounded-lg bg-red-500 p-2 text-center"
                onClick={() => {
                  setIsEditing(false);
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
}
