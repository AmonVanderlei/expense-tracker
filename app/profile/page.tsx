"use client";
import Image from "next/image";
import profilePic from "@/public/blank-profile-picture.png";
import { MdOutlineBookmarkAdd } from "react-icons/md";
import { FiUser } from "react-icons/fi";
import { LiaInfoSolid } from "react-icons/lia";
import { VscSignOut } from "react-icons/vsc";
import { useContext } from "react";
import { DataContext } from "@/contexts/dataContext";

export default function Profile() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("DataContext must be used within a DataContextProvider");
  }
  const { user } = context;

  return (
    <div className="grow">
      {/* Header */}
      <header className="w-full flex items-center justify-center relative pt-4">
        <h1 className="text-xl font-bold">Profile</h1>
      </header>

      {/* User Info */}
      <div className="flex flex-col items-center relative bg-slate-900 mt-28 pb-4 rounded-t-2xl">
        <Image
          src={profilePic}
          alt="Profile picture"
          width={150}
          height={150}
          className="rounded-full -translate-y-1/2"
        />
        <div className="absolute bottom-4 w-full flex flex-col items-center">
          <p className="text-2xl font-bold">
            {user.firstName} {user.lastName}
          </p>
          <p className="text-base">{user.email}</p>
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
          <LiaInfoSolid className="text-3xl" /> About
        </a>
        <li className="flex gap-2">
          <MdOutlineBookmarkAdd className="text-3xl" /> Add Category
        </li>
        <li className="flex gap-2">
          <FiUser className="text-3xl" />
          Change Name
        </li>
        <li className="flex gap-2">
          <VscSignOut className="text-3xl" />
          Log Out
        </li>
        <div className="flex justify-end w-full underline">
          <a
            href="https://github.com/AmonVanderlei"
            target="_blank"
            rel="noopener noreferrer"
          >
            Made by Amon Vanderlei
          </a>
        </div>
      </ul>
    </div>
  );
}
