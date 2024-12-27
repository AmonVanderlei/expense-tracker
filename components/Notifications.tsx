"use client";
import { FaRegBell } from "react-icons/fa";
import clsx from "clsx";
import { useEffect, useState } from "react";

export default function Transactions() {
  const [newNotifications, SetNewNotifications] = useState<boolean>(false);

  function hideNewNotifications() {
    SetNewNotifications(!newNotifications);
  }

  useEffect(() => {
    SetNewNotifications(true);
  }, []);

  return (
    <div className="flex items-center relative" onClick={hideNewNotifications}>
      <FaRegBell className="text-2xl" />
      <div
        className={clsx(
          "w-3 h-3 text-transparent absolute top-3 right-0 rounded-full bg-none",
          newNotifications && "bg-red-600"
        )}
      >
        .
      </div>
    </div>
  );
}
