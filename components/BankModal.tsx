import { useRef, useState, useContext, Dispatch, SetStateAction } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import Modal from "@/components/ModalComponent";
import { DataContext } from "@/contexts/dataContext";
import { toast } from "react-toastify";
import { AuthContext } from "@/contexts/authContext";
import Bank from "@/types/Bank";

interface Props {
  show: boolean;
  onClose: Dispatch<SetStateAction<boolean>>;
}

export default function BankModal({ show, onClose }: Props) {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("DataContext must be used within a DataContextProvider");
  }
  const { banks, addObj, updateObj, deleteObj } = context;

  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("AuthContext must be used within a AuthContextProvider");
  }
  const { user, messages } = authContext;

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);

  const nameRef = useRef<HTMLInputElement | null>(null);
  const colorRef = useRef<HTMLInputElement | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const bankName = nameRef.current?.value.trim();
    const color = colorRef.current?.value.trim();

    if (!bankName || !color) {
      toast.warning(messages.form.fillAll);
      return;
    }

    if (selectedBank) {
      updateObj({ ...selectedBank, color, bankName });
    } else {
      addObj({
        id: "",
        color,
        bankName,
        uid: user?.uid as string,
      });
    }

    setIsEditing(false);
    setSelectedBank(null);
  };

  const handleEdit = (bank: Bank) => {
    setSelectedBank(bank);
    setIsEditing(true);
  };

  const handleDelete = (bank: Bank) => {
    deleteObj(bank);
  };

  const handleCreate = () => {
    setSelectedBank(null);
    setIsEditing(true);
  };

  return (
    <Modal show={show} onClose={onClose}>
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-bold">
          {messages.other.manage} {messages.other.banks}
        </h2>

        {!isEditing ? (
          <div className="flex flex-col gap-4">
            <ul className="flex flex-col gap-3 max-h-[70vh] overflow-scroll">
              {banks.map((bank) => (
                <li
                  key={bank.id}
                  className="flex items-center bg-slate-700 p-2 rounded-xl"
                >
                  <div
                    className="grow flex items-center gap-2"
                    onClick={() => handleEdit(bank)}
                  >
                    <div
                      style={{ backgroundColor: bank.color }}
                      className="w-4 h-4 rounded-full"
                    />
                    <strong className="text-lg">{bank.bankName}</strong>
                  </div>
                  <button className="px-2" onClick={() => handleDelete(bank)}>
                    <FaRegTrashAlt className="text-red-600" />
                  </button>
                </li>
              ))}
            </ul>
            <button
              className="font-bold rounded-lg bg-slate-500 p-2 text-center"
              onClick={handleCreate}
            >
              {messages.button.add} {messages.other.bank}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSave} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="font-bold text-sm" htmlFor="name">
                {messages.other.bank}
              </label>
              <input
                type="text"
                name="name"
                className="p-2 rounded-xl bg-slate-700 border"
                ref={nameRef}
                defaultValue={selectedBank?.bankName || ""}
                placeholder={messages.form.type}
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-bold text-sm" htmlFor="color">
                {messages.other.color}
              </label>
              <input
                name="color"
                className="w-full h-10 p-2 rounded-xl bg-slate-700 border"
                ref={colorRef}
                type="color"
                defaultValue={selectedBank?.color || ""}
                placeholder={messages.form.select}
                required
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="w-2/3 font-bold rounded-lg bg-slate-500 p-2 text-center"
              >
                {selectedBank
                  ? messages.button.save
                  : messages.button.add + " " + messages.other.bank}
              </button>
              <button
                type="button"
                className="w-1/3 font-bold rounded-lg bg-red-500 p-2 text-center"
                onClick={() => {
                  setIsEditing(false);
                  setSelectedBank(null);
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
