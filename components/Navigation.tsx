"use client";
import Link from "next/link";
import { BiHome } from "react-icons/bi";
import { TbFileReport } from "react-icons/tb";
import { GrAddCircle } from "react-icons/gr";
import { TiArrowRepeatOutline } from "react-icons/ti";
import { MdPersonOutline } from "react-icons/md";
import { useContext, useState } from "react";
import clsx from "clsx";
import { AuthContext } from "@/contexts/authContext";

export default function Navigation() {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("AuthContext must be used within a AuthContextProvider");
  }
  const { messages } = authContext;

  const [activePage, setActivePage] = useState<string>("Home");

  function changeActivePage(e: React.MouseEvent<HTMLAnchorElement>) {
    setActivePage(e.currentTarget.id);
  }

  return (
    <div className="flex justify-around items-center fixed bg-slate-900 border-slate-600 w-full h-16 bottom-0 border-t rounded-t-lg md:w-24 md:h-full md:flex-col md:left-0 md:border-r md:border-t-0 md:rounded-l-none md:rounded-r-lg">
      <Link
        href={"/"}
        onClick={changeActivePage}
        id="Home"
        className={clsx(
          "justify-items-center",
          activePage == "Home" && "text-blue-300"
        )}
      >
        <BiHome className="text-2xl" />{" "}
        <p className="text-sm">{messages.other.home}</p>
      </Link>
      <Link
        href={"/reports"}
        onClick={changeActivePage}
        id="Reports"
        className={clsx(
          "justify-items-center",
          activePage == "Reports" && "text-blue-300"
        )}
      >
        <TbFileReport className="text-2xl" />
        <p className="text-sm">{messages.other.reports}</p>
      </Link>
      <Link
        href={"/add"}
        onClick={changeActivePage}
        id="Add"
        className={clsx(
          "justify-items-center",
          activePage == "Add" && "text-blue-300"
        )}
      >
        <GrAddCircle className="text-2xl" />
        <p className="text-sm">{messages.button.add}</p>
      </Link>
      <Link
        href={"/transactions"}
        onClick={changeActivePage}
        id="Transactions"
        className={clsx(
          "justify-items-center",
          activePage == "Transactions" && "text-blue-300"
        )}
      >
        <TiArrowRepeatOutline className="text-2xl" />
        <p className="text-sm">{messages.other.transactions}</p>
      </Link>
      <Link
        href={"/profile"}
        onClick={changeActivePage}
        id="Profile"
        className={clsx(
          "justify-items-center",
          activePage == "Profile" && "text-blue-300"
        )}
      >
        <MdPersonOutline className="text-2xl" />
        <p className="text-sm">{messages.other.profile}</p>
      </Link>
    </div>
  );
}
