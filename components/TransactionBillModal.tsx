import {
  useRef,
  useState,
  useContext,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react";
import Modal from "@/components/ModalComponent";
import { DataContext } from "@/contexts/dataContext";
import Transaction from "@/types/Transaction";
import Bill from "@/types/Bill";
import clsx from "clsx";
import { formatCurrency } from "@/utils/formatCurrency";
import { toast } from "react-toastify";
import { AuthContext } from "@/contexts/authContext";

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

  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("AuthContext must be used within a AuthContextProvider");
  }
  const { messages } = authContext;

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [type, setType] = useState<"income" | "expense">(
    selectedObj?.type || "income"
  );
  const [categoryId, setCategoryId] = useState<string>(
    selectedObj?.categoryId.toString() || ""
  );

  const nameRef = useRef<HTMLInputElement | null>(null);
  const amountRef = useRef<HTMLInputElement | null>(null);
  const paymentDayRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (selectedObj) {
      setType(selectedObj.type);
    }
  }, [selectedObj]);

  if (!selectedObj) return null;

  const isTransaction = (obj: Transaction | Bill): obj is Transaction => {
    return (obj as Transaction).date !== undefined;
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const name = nameRef.current?.value.trim();
    const amount = amountRef.current?.value.trim();

    if (!name || !amount || !type || !categoryId) {
      toast.warning(messages.form.fillAll);
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
        toast.warning(messages.form.paymentDay);
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
          {isEditing ? messages.button.edit + " " : ""}
          {isTransaction(selectedObj)
            ? messages.other.transaction
            : messages.other.bill}
          {isEditing ? " " : " - " + messages.button.details}
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
              <strong>
                {selectedObj.type === "income"
                  ? messages.form.from
                  : messages.form.to}
                :
              </strong>
              <p>{selectedObj.destiny}</p>
            </div>
            <div className="flex justify-between items-center">
              <strong>{messages.form.amount}:</strong>
              <p>{formatCurrency(selectedObj.amount)}</p>
            </div>

            {isTransaction(selectedObj) ? (
              <div className="flex justify-between items-center">
                <strong>{messages.form.date}:</strong>
                <p>{selectedObj.date.toLocaleDateString()}</p>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <strong>{messages.form.payDay}:</strong>
                <p>{selectedObj.paymentDay}</p>
              </div>
            )}

            {!isTransaction(selectedObj) && (
              <div className="flex justify-between items-center">
                <strong>{messages.other.paid}:</strong>
                <p>
                  {selectedObj.paid ? messages.other.yes : messages.other.no}
                </p>
              </div>
            )}

            <div className="flex flex-col gap-2 mt-5">
              <button
                className="w-full font-bold rounded-lg bg-blue-500 p-2 text-center"
                onClick={() => setIsEditing(true)}
              >
                {messages.button.edit}
              </button>
              <button
                className="w-full font-bold rounded-lg bg-red-500 p-2 text-center"
                onClick={() => handleDelete(selectedObj)}
              >
                {messages.button.delete}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSave} className="flex flex-col gap-4 mt-4">
            {/* Form type */}
            <select
              name="selectType"
              className="text-slate-800 rounded-md p-2 w-full"
              onChange={(e) => setType(e.target.value as "income" | "expense")}
              defaultValue={selectedObj.type}
            >
              <option value="income">{messages.other.income}</option>
              <option value="expense">{messages.other.expense}</option>
            </select>

            {/* Name */}
            <div className="flex flex-col gap-1">
              <label className="font-bold text-sm" htmlFor="name">
                {selectedObj.type === "income"
                  ? messages.form.from
                  : messages.form.to}
              </label>
              <input
                type="text"
                name="name"
                className="p-2 rounded-xl bg-slate-700 border"
                ref={nameRef}
                defaultValue={selectedObj.destiny}
                placeholder={messages.form.type}
                required
              />
            </div>

            {/* Amount */}
            <div className="flex flex-col gap-1">
              <label className="font-bold text-sm" htmlFor="amount">
                {messages.form.amount}
              </label>
              <input
                type="number"
                min={0}
                step={0.01}
                name="amount"
                className="p-2 rounded-xl bg-slate-700 border"
                ref={amountRef}
                defaultValue={selectedObj.amount}
                placeholder={messages.form.type}
                required
              />
            </div>

            {/* Payment Day */}
            {!isTransaction(selectedObj) && (
              <div className="flex flex-col gap-1">
                <label className="font-bold text-sm" htmlFor="paymentDay">
                  {messages.form.payDay}
                </label>
                <input
                  type="number"
                  min={1}
                  max={31}
                  name="paymentDay"
                  className="p-2 rounded-xl bg-slate-700 border"
                  ref={paymentDayRef}
                  defaultValue={selectedObj.paymentDay}
                  placeholder={messages.form.type}
                  required
                />
              </div>
            )}

            {/* Category */}
            <div className="flex flex-col gap-1">
              <label className="font-bold text-sm" htmlFor="category">
                {messages.form.select} {messages.other.category.toLowerCase()}
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

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                type="submit"
                className="w-2/3 font-bold rounded-lg bg-green-500 p-2 text-center"
              >
                {messages.button.save}
              </button>
              <button
                type="button"
                className="w-1/3 font-bold rounded-lg bg-red-500 p-2 text-center"
                onClick={() => {
                  setIsEditing(false);
                }}
              >
                {messages.button.cancel}
              </button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
}
