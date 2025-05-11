"use client";
import React, { useState } from "react";
import Link from "next/link";
import { X, Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import UserDropDown from "@/components/shared/UserDropDown";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

type NavLinkPropType = {
  route: string;
  children: React.ReactNode;
};

const NavLink = ({ route, children }: NavLinkPropType) => {
  const pathname = usePathname();
  return (
    <li className="text-black flex justify-start px-8 md:px-3 text-lg my-1 bg-gray-100 md:bg-transparent border-primary">
      <Link
        className={`hover:font-medium p-1 cursor-pointer box-border font-medium text-nowrap ${
          pathname !== route
            ? "text-gray-950 hover:text-primary"
            : "text-primary hover:text-primary"
        }`}
        href={route}
      >
        {children}
      </Link>
    </li>
  );
};

export default function Header() {
  const [navActive, setNavActive] = useState(false);
  const [userDropDown, setUserDropDown] = useState(false);
  const { data: session, status } = useSession();

  const changeUserDropDown = (value: boolean) => {
    setUserDropDown(value);
  };

  return (
    <nav className="bg-white flex items-center justify-between px-4 py-1 box-border gap-4 sticky top-2 h-20 z-[99] md:px-[5vw] w-5/6 shadow-lg rounded-full mx-auto">
      <Link className="flex" href="/">
        <Image
          src="/assets/logo.png"
          className="h-9 w-auto"
          alt="logo"
          width={3000}
          height={3000}
        />
      </Link>

      <div
        className={`md:w-[85%] lg:w-[70%] md:flex justify-between md:py-1 md:h-full items-center md:static md:flex-row overflow-hidden md:overflow-visible md:px-3 fixed z-[99] flex-col h-[100vh] transition-all duration-500 w-0 ${
          navActive ? "w-60" : ""
        } top-0 right-0 bg-gray-100 md:bg-transparent shadow-gray-300 shadow-3xl md:gap-4 gap-1 py-2`}
      >
        <ul className="md:w-[80%] flex flex-col justify-between md:flex-row gap-7 md:justify-center">
          <div className="w-full flex justify-end md:hidden">
            <button
              className="text-2xl p-3 text-gray-400"
              onClick={() => setNavActive(false)}
            >
              <X />
            </button>
          </div>
          <NavLink route="/">Home</NavLink>
          <NavLink route="/about">About</NavLink>
          <NavLink route="/dashboard">Dashboard</NavLink>
          <NavLink route="/contact">Contact Us</NavLink>
        </ul>

        {status == "unauthenticated" && (
          <div className="md:w-[20%] flex items-center w-full justify-center pr-2 gap-2 mt-10 md:mt-0">
            <Button>
              <Link href="/signin">Signin</Link>
            </Button>
            <Button>
              <Link href="/signup">Signup</Link>
            </Button>
          </div>
        )}
      </div>

      <div className="flex items-center gap-1">
        {status == "authenticated" && (
          <UserDropDown
            userDropDown={userDropDown}
            changeUserDropDown={changeUserDropDown}
            user={session?.user}
          />
        )}
        <button
          className="text-2xl p-2 text-gray-400 md:hidden"
          onClick={() => setNavActive(true)}
        >
          <Menu />
        </button>
      </div>
    </nav>
  );
}
