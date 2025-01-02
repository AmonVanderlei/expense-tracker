import { useRef, useState, useContext, Dispatch, SetStateAction } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import Modal from "@/components/ModalComponent";
import { DataContext } from "@/contexts/dataContext";
import Category from "@/types/Category";
import { toast } from "react-toastify";

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
      toast.warning("Please fill out all fields.");
      return;
    }

    if (selectedCategory) {
      updateObj({ ...selectedCategory, color, name });
    } else {
      addObj({
        id: Date.now(),
        color,
        name,
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
        <h2 className="text-xl font-bold">Manage Categories</h2>

        {!isEditing ? (
          <div className="flex flex-col gap-4">
            <ul className="flex flex-col gap-3 max-h-[70vh] overflow-scroll">
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
              Add New Category
            </button>
          </div>
        ) : (
          <form onSubmit={handleSave} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="font-bold text-sm" htmlFor="name">
                Category Name
              </label>
              <input
                type="text"
                name="name"
                className="p-2 rounded-xl bg-slate-700 border"
                ref={nameRef}
                defaultValue={selectedCategory?.name || ""}
                placeholder="Enter category name"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-bold text-sm" htmlFor="color">
                Color
              </label>
              <input
                name="color"
                className="w-full h-10 p-2 rounded-xl bg-slate-700 border"
                ref={colorRef}
                type="color"
                defaultValue={selectedCategory?.color || ""}
                placeholder="Enter category color"
                required
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="w-2/3 font-bold rounded-lg bg-slate-500 p-2 text-center"
              >
                {selectedCategory ? "Save Changes" : "Add Category"}
              </button>
              <button
                type="button"
                className="w-1/3 font-bold rounded-lg bg-red-500 p-2 text-center"
                onClick={() => {
                  setIsEditing(false);
                  setSelectedCategory(null);
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
