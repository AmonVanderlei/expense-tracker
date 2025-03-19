import { useRef, useState, useContext, Dispatch, SetStateAction } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import Modal from "@/components/ModalComponent";
import { DataContext } from "@/contexts/dataContext";
import Category from "@/types/Category";
import { toast } from "react-toastify";
import { AuthContext } from "@/contexts/authContext";

interface Props {
  show: boolean;
  onClose: Dispatch<SetStateAction<boolean>>;
}

export default function CategoryModal({ show, onClose }: Props) {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("DataContext must be used within a DataContextProvider");
  }
  const { categories, addObj, updateObj, deleteObj } = context;

  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("AuthContext must be used within a AuthContextProvider");
  }
  const { user, messages } = authContext;

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );

  const nameRef = useRef<HTMLInputElement | null>(null);
  const colorRef = useRef<HTMLInputElement | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const name = nameRef.current?.value.trim();
    const color = colorRef.current?.value.trim();

    if (!name || !color) {
      toast.warning(messages.form.fillAll);
      return;
    }

    if (selectedCategory) {
      updateObj({ ...selectedCategory, color, name });
    } else {
      addObj({
        id: "",
        color,
        name,
        uid: user?.uid as string,
      });
    }

    setIsEditing(false);
    setSelectedCategory(null);
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setIsEditing(true);
  };

  const handleDelete = (category: Category) => {
    deleteObj(category);
  };

  const handleCreate = () => {
    setSelectedCategory(null);
    setIsEditing(true);
  };

  return (
    <Modal show={show} onClose={onClose}>
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-bold">
          {messages.other.manage} {messages.other.categories}
        </h2>

        {!isEditing ? (
          <div className="flex flex-col gap-4">
            <ul className="flex flex-col gap-3 max-h-[70vh] overflow-y-auto">
              {categories.map((category) => (
                <li
                  key={category.id}
                  className="flex items-center bg-slate-700 p-2 rounded-xl"
                >
                  <div
                    className="grow flex items-center gap-2"
                    onClick={() => handleEdit(category)}
                  >
                    <div
                      style={{ backgroundColor: category.color }}
                      className="w-4 h-4 rounded-full"
                    />
                    <strong className="text-lg">{category.name}</strong>
                  </div>
                  <button
                    className="px-2"
                    onClick={() => handleDelete(category)}
                  >
                    <FaRegTrashAlt className="text-red-600" />
                  </button>
                </li>
              ))}
            </ul>
            <button
              className="font-bold rounded-lg bg-slate-500 p-2 text-center"
              onClick={handleCreate}
            >
              {messages.button.add} {messages.other.category}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSave} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="font-bold text-sm" htmlFor="name">
                {messages.other.category}
              </label>
              <input
                type="text"
                name="name"
                className="p-2 rounded-xl bg-slate-700 border"
                ref={nameRef}
                defaultValue={selectedCategory?.name || ""}
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
                defaultValue={selectedCategory?.color || ""}
                placeholder={messages.form.select}
                required
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="w-2/3 font-bold rounded-lg bg-slate-500 p-2 text-center"
              >
                {selectedCategory
                  ? messages.button.save
                  : messages.button.add + " " + messages.other.category}
              </button>
              <button
                type="button"
                className="w-1/3 font-bold rounded-lg bg-red-500 p-2 text-center"
                onClick={() => {
                  setIsEditing(false);
                  setSelectedCategory(null);
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
