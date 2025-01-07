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

export default function Profile() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("DataContext must be used within a DataContextProvider");
  }
  const { user, loading, logout, messages } = context;

  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [language, setLanguage] = useState<string>(
    typeof window !== "undefined"
      ? localStorage.getItem("language") || "en-us"
      : "en-us"
  );

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
    if (!loading && !user) {
      router.push("/auth");
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="grow w-full h-full flex items-center justify-center">
        <p className="text-xl">{messages.loading.loading}</p>
      </div>
    );
  }
  return (
    <div className="grow">
      <CategoryModal show={modalIsOpen} onClose={setModalIsOpen} />
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
          className="flex gap-2"
          onClick={(e) => {
            e.preventDefault();
            setModalIsOpen(true);
          }}
        >
          <MdOutlineBookmarkAdd className="text-3xl" />
          {messages.other.manage} {messages.other.category}
        </li>
        <li className="flex gap-2" onClick={handleLanguage}>
          <HiLanguage className="text-3xl" />
          {messages.form.select} {messages.other.language}
        </li>
        <li className="flex gap-2" onClick={logout}>
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
