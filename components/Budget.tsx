import { AuthContext } from "@/contexts/authContext";
import { DataContext } from "@/contexts/dataContext";
import { formatCurrency } from "@/utils/formatCurrency";
import { useContext, useRef } from "react";
import { toast, ToastContentProps } from "react-toastify";

interface Props {
  expenses: number;
}

export default function Budget({ expenses }: Props) {
  const dataContext = useContext(DataContext);
  if (!dataContext) {
    throw new Error("DataContext must be used within a DataContextProvider");
  }
  const { visibleValues, budget, addObj, updateObj } = dataContext;

  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("AuthContext must be used within a AuthContextProvider");
  }
  const { user, messages } = authContext;

  const budgetRef = useRef<HTMLInputElement | null>(null);

  const handleSave = () => {
    const num = budgetRef.current?.value.trim();

    if (!num) {
      toast.warning(messages.form.valid);
      return;
    }

    if (budget.id == "") {
      addObj({
        id: budget.id,
        bdgt: +num,
        uid: user?.uid as string,
      });
    } else {
      updateObj({
        id: budget.id,
        bdgt: +num,
        uid: user?.uid as string,
      });
    }
  };

  function CustomNotification({ closeToast }: ToastContentProps) {
    return (
      <div className="flex flex-col gap-4 w-full">
        <label className="font-bold text-sm" htmlFor="amount">
          {messages.form.budget}:
        </label>
        <input
          type="number"
          min={0}
          step={0.01}
          name="amount"
          className="p-2 rounded-xl bg-slate-700 border"
          ref={budgetRef}
          placeholder={messages.form.type}
          required
        />
        <div className="flex w-full gap-2">
          <button
            className="font-bold rounded-lg bg-slate-500 p-2 text-center w-1/2"
            onClick={closeToast}
          >
            {messages.button.cancel}
          </button>
          <button
            className="font-bold rounded-lg bg-blue-500 p-2 text-center w-1/2"
            onClick={() => closeToast("save")}
          >
            {messages.button.save}
          </button>
        </div>
      </div>
    );
  }

  const handleToast = () => {
    toast(CustomNotification, {
      closeButton: false,
      position: "bottom-center",
      autoClose: false,
      draggable: false,
      onClose(reason) {
        switch (reason) {
          case "save":
            handleSave();
        }
      },
    });
  };

  return (
    <div
      onClick={handleToast}
      className="w-11/12 bg-blue-950 p-2 rounded-lg bg-opacity-50"
    >
      <div className="flex justify-between items-center flex-wrap">
        <h2 className="text-lg text-blue-500 font-bold">
          {messages.form.budget}
        </h2>
        <p className="text-lg text-blue-700 font-black">
          {visibleValues ? formatCurrency(budget?.bdgt) : "* * * *"}
        </p>
      </div>

      <div className="h-2 bg-gray-900 rounded-full overflow-hidden">
        <div
          className="h-2 bg-blue-200 w-0 transition-all"
          style={{ width: `${Math.max((100 * expenses) / budget?.bdgt, 0)}%` }}
        ></div>
      </div>

      {visibleValues ? (
        <div className="flex justify-between text-sm flex-wrap">
          <p className="text-blue-500">
            {messages.other.spent}: {formatCurrency(expenses)}/
            {Math.round((100 * expenses) / budget?.bdgt) || 0}%
          </p>
          <p className="text-blue-300">
            {messages.other.left}: {formatCurrency(budget?.bdgt - expenses)}/
            {100 - Math.round((100 * expenses) / budget?.bdgt) || 100}%
          </p>
        </div>
      ) : (
        <div className="flex justify-between text-sm flex-wrap">
          <p className="text-blue-500">
            {messages.other.spent}: * * * *
          </p>
          <p className="text-blue-300">
            {messages.other.left}: * * * *
          </p>
        </div>
      )}
    </div>
  );
}
