"use client";
import Image from "next/image";
import { MdOutlineBookmarkAdd } from "react-icons/md";
import { LiaInfoSolid } from "react-icons/lia";
import { VscSignOut } from "react-icons/vsc";
import { useContext, useEffect, useState } from "react";
import CategoryModal from "@/components/CategoryModal";
import { AuthContext } from "@/contexts/authContext";
import { useRouter } from "next/navigation";
import { HiLanguage } from "react-icons/hi2";
import { toast } from "react-toastify";
import { PiBank } from "react-icons/pi";
import BankModal from "@/components/BankModal";
import { DataContext } from "@/contexts/dataContext";
import Loading from "@/components/Loading";

export default function Profile() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("DataContext must be used within a DataContextProvider");
  }
  const { banks, categories } = context;

  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("DataContext must be used within a DataContextProvider");
  }
  const { user, loading, logout, messages } = authContext;

  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [bankModalIsOpen, setBankModalIsOpen] = useState<boolean>(false);
  const [language, setLanguage] = useState<string>(
    typeof window !== "undefined"
      ? localStorage.getItem("language") || "en-us"
      : "en-us"
  );
  const [hasMounted, setHasMounted] = useState(false);

  const router = useRouter();

  const saveLanguage = () => {
    if (language == "en-us") {
      localStorage.setItem("language", "pt-br");
      setLanguage("pt-br");
    } else {
      localStorage.setItem("language", "en-us");
      setLanguage("en-us");
    }
    toast.success(messages.success.update);
  };

  const handleLanguage = () => {
    toast(
      ({ closeToast }) => (
        <div className="flex flex-col gap-4 w-full">
          <div>
            <h1 className="font-bold text-lg">
              {language == "en-us"
                ? "Mudar para o português"
                : "Change to English"}
            </h1>
            <p className="text-xs">
              {language == "en-us"
                ? "Você deve reiniciar a aplicação para a mudança ser aplicada."
                : "You must refresh the app to apply the change."}
            </p>
          </div>
          <div className="flex w-full gap-2">
            <button
              className="font-bold rounded-lg bg-slate-500 p-2 text-center w-1/2"
              onClick={closeToast}
            >
              {messages.button.cancel}
            </button>
            <button
              className="font-bold rounded-lg bg-blue-500 p-2 text-center w-1/2"
              onClick={() => {
                saveLanguage();
                closeToast();
              }}
            >
              {messages.button.save}
            </button>
          </div>
        </div>
      ),
      {
        closeButton: false,
        position: "bottom-center",
        autoClose: false,
        draggable: false,
      }
    );
  };

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth");
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (banks.length < 1) {
      toast.warning(messages.other.atLeastBank);
    }
    if (categories.length < 1) {
      toast.warning(messages.other.atLeastCategory);
    }
  }, [banks, categories]);

  if (!hasMounted || loading) {
    return (
      <div className="absolute top-1/2 left-[47%]">
        <Loading />
      </div>
    );
  }

  return (
    <div className="grow">
      {/* Modals */}
      <CategoryModal show={modalIsOpen} onClose={setModalIsOpen} />
      <BankModal show={bankModalIsOpen} onClose={setBankModalIsOpen} />

      {/* Header */}
      <header className="w-full flex items-center justify-center relative pt-4">
        <h1 className="text-xl font-bold">{messages.other.profile}</h1>
      </header>

      {/* User Info */}
      <div className="flex flex-col items-center relative bg-slate-900 mt-28 pb-4 rounded-t-2xl">
        {user?.photoURL && (
          <Image
            src={user?.photoURL as string}
            alt="Profile picture"
            width={150}
            height={150}
            className="rounded-full -translate-y-1/2"
          />
        )}
        <div className="absolute bottom-4 w-full flex flex-col items-center">
          <p className="text-2xl font-bold">{user?.displayName}</p>
          <p className="text-base">{user?.email}</p>
        </div>
      </div>

      {/* Settings */}
      <ul className="flex flex-col px-4 py-6 mt-10 text-lg bg-slate-900 rounded-b-2xl gap-4">
        <a
          href="https://github.com/AmonVanderlei/expense-tracker"
          target="_blank"
          rel="noopener noreferrer"
          className="flex gap-2"
        >
          <LiaInfoSolid className="text-3xl" /> {messages.other.about}
        </a>
        <li
          className="flex gap-2 cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            setModalIsOpen(true);
          }}
        >
          <MdOutlineBookmarkAdd className="text-3xl" />
          {messages.other.manage} {messages.other.categories}
        </li>
        <li
          className="flex gap-2 cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            setBankModalIsOpen(true);
          }}
        >
          <PiBank className="text-3xl" />
          {messages.other.manage} {messages.other.banks}
        </li>
        <li className="flex gap-2 cursor-pointer" onClick={handleLanguage}>
          <HiLanguage className="text-3xl" />
          {messages.form.select} {messages.other.language}
        </li>
        <li className="flex gap-2 cursor-pointer" onClick={logout}>
          <VscSignOut className="text-3xl" />
          {messages.other.logout}
        </li>
        <div className="flex justify-end w-full underline">
          <a
            href="https://github.com/AmonVanderlei"
            target="_blank"
            rel="noopener noreferrer"
          >
            {messages.other.madeBy} Amon Vanderlei
          </a>
        </div>
      </ul>
    </div>
  );
}
