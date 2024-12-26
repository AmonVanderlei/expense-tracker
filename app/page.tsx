"use client";
import Image from "next/image";
import profilePic from "@/public/blank-profile-picture.png";
import { FaRegBell } from "react-icons/fa";
import { useState } from "react";
import clsx from "clsx";

export default function Home() {
  // User Info and Notifications
  const [userName, setUserName] = useState<string>("Amon Vanderlei");
  // const [profilePic, setProfilePic] = useState<string>("url here");
  const [newNotifications, SetNewNotifications] = useState<boolean>(true);

  return (
    <div className="grow">
      {/* User Info and Notifications */}
      <div className="w-full flex justify-between px-3 pt-3">
        <div className="flex items-center gap-3">
          <Image
            src={profilePic}
            alt="Profile picture"
            width={40}
            height={40}
            className="rounded-full"
          />
          <div className="flex flex-col">
            <p className="text-sm">Hello,</p>
            <p className="text-lg font-bold">{userName}</p>
          </div>
        </div>
        <div className="flex items-center relative">
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
      </div>
    </div>
  );
}
