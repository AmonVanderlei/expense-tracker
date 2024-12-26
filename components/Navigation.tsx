"use client";
import Link from "next/link";
import { BiHome } from "react-icons/bi";
import { TbFileReport } from "react-icons/tb";
import { GrAddCircle } from "react-icons/gr";
import { TiArrowRepeatOutline } from "react-icons/ti";
import { MdPersonOutline } from "react-icons/md";
import { useState } from "react";
import clsx from "clsx";

export default function Navigation() {
  const [activePage, setActivePage] = useState<string>("Home");

  function changeActivePage(e: React.MouseEvent<HTMLAnchorElement>) {
    setActivePage(e.currentTarget.id);
  }

  return (
    <div className="w-full absolute bottom-0 bg-slate-900 h-16 flex justify-around items-center border-t rounded-t-lg border-slate-600">
      <Link
        href={"/"}
        onClick={changeActivePage}
        id="Home"
        className={clsx(
          "justify-items-center",
          activePage == "Home" && "text-blue-300"
        )}
      >
        <BiHome className="text-2xl" /> <p className="text-sm">Home</p>
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
        <p className="text-sm">Reports</p>
      </Link>
      <div className="justify-items-center">
        <GrAddCircle className="text-2xl" />
        <p className="text-sm">Add</p>
      </div>
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
        <p className="text-sm">Transactions</p>
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
        <p className="text-sm">Profile</p>
      </Link>
    </div>
  );
}
