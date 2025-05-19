"use client";

import { User } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { UserRole } from "@/types/UserTypes";
import { useState } from "react";

interface UserDropDownProps {
  userDropDown: boolean;
  user: User;
  changeUserDropDown: (value: boolean) => void;
}

const UserDropDown = ({
  userDropDown,
  changeUserDropDown,
  user,
}: UserDropDownProps) => {
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut({ callbackUrl: "/signin" });
    } catch (error) {
      console.error("Sign out error:", error);
      setIsSigningOut(false);
    }
  };

  return (
    <div className="relative min-w-8">
      <button
        type="button"
        className="flex text-sm rounded-full mr-0"
        onClick={() => changeUserDropDown(!userDropDown)}
        aria-label="Toggle user menu"
      >
        <Image
          className="w-8 h-8 rounded-full shadow-sm"
          src={user?.profilePicture?.url || "/assets/user.png"}
          alt="User photo"
          width={32}
          height={32}
        />
      </button>

      {/* Dropdown Menu */}
      <div
        className={`z-10 my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow absolute right-0 top-5 max-w-[170px] overflow-hidden transition-all duration-300 ease-in-out ${
          !userDropDown ? "h-0" : "h-auto"
        }`}
      >
        <div className="px-4 py-3">
          <span className="block text-sm text-gray-900 truncate">
            {user.fullName}
          </span>
          <span className="block text-sm text-gray-500 truncate">
            {user.email}
          </span>
        </div>
        <ul className="py-2">
          <li>
            <Link
              href="/dashboard/profile"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 truncate"
            >
              My Profile
            </Link>
          </li>
          <li>
            <Link
              href="/dashboard/notifications"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 truncate"
            >
              Notifications
            </Link>
          </li>
          <li>
            <Link
              href="/dashboard/settings"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 truncate"
            >
              Settings
            </Link>
          </li>
          {user.userRole === UserRole.ADMIN && (
            <li>
              <Link
                href="/admin/dashboard"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 truncate"
              >
                Admin Dashboard
              </Link>
            </li>
          )}
          <li>
            <button
              className="block px-4 py-2 text-sm w-full text-start text-gray-700 hover:bg-gray-100 truncate disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleSignOut}
              disabled={isSigningOut}
            >
              {isSigningOut ? "Signing out..." : "Sign out"}
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default UserDropDown;
