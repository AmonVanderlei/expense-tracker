"use client";
import { AuthContext } from "@/contexts/authContext";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";
import { LiaInfoSolid } from "react-icons/lia";
import { toast } from "react-toastify";
import { FcGoogle } from "react-icons/fc";
import Image from "next/image";

export default function Auth() {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("AuthContext must be used within a AuthContextProvider");
  }
  const { googleLoginHandler, user, loading, messages } = authContext;

  const router = useRouter();

  async function handleLogin() {
    const id = await googleLoginHandler();
    if (id) {
      router.push("/");
    } else {
      toast.error(messages.error.login);
    }
  }

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [loading, user, router]);

  return (
    <div className="grow flex flex-col items-center justify-between h-[80vh]">
      <div className="flex flex-col items-center w-11/12 gap-16 mt-20">
        <Image
          src="/icons/android-chrome-512x512.png"
          alt="Logo"
          width={512}
          height={512}
          className="max-w-40 rounded-full border-4 border-slate-900"
        />
        <div>
          <h1 className="text-2xl">Expense Tracker</h1>
          <p className="text-sm text-slate-400">{messages.other.signin}</p>
        </div>
        <button
          onClick={handleLogin}
          className="flex items-center justify-center gap-2 rounded-lg bg-white py-2 w-full"
        >
          <FcGoogle className="text-2xl" />
          <p className="text-lg text-black">{messages.other.google}</p>
        </button>
      </div>

      {/* Credits */}
      <div className="flex flex-col w-11/12 text-sm">
        <a
          href="https://github.com/AmonVanderlei/expense-tracker"
          target="_blank"
          rel="noopener noreferrer"
          className="flex gap-1"
        >
          <LiaInfoSolid className="text-2xl" /> {messages.other.learnMore}
        </a>
        <div className="flex justify-end w-full underline">
          <a
            href="https://github.com/AmonVanderlei"
            target="_blank"
            rel="noopener noreferrer"
          >
            {messages.other.madeBy} Amon Vanderlei
          </a>
        </div>
      </div>
    </div>
  );
}
