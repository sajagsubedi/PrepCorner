import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Home, Info, Phone, Wrench } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="w-full absolute z-50 top-0 left-0 py-1">
      <nav
        className={cn(
          "sticky top-4 z-50 w-[90%] max-w-6xl mx-auto",
          "bg-white shadow-lg rounded-2xl px-6 py-3 flex items-center justify-between"
        )}
      >
        {/* Left: Brand */}
        <div className="text-2xl font-bold text-gray-800">PrepCorner</div>

        {/* Center: Nav Links */}
        <ul className="flex space-x-6 text-gray-700 font-medium">
          <li className="flex items-center gap-1 hover:text-blue-600 cursor-pointer">
            <Home size={18} /> Home
          </li>
          <li className="flex items-center gap-1 hover:text-blue-600 cursor-pointer">
            <Info size={18} /> About
          </li>
          <li className="flex items-center gap-1 hover:text-blue-600 cursor-pointer">
            <Wrench size={18} /> Services
          </li>
          <li className="flex items-center gap-1 hover:text-blue-600 cursor-pointer">
            <Phone size={18} /> Contact
          </li>
        </ul>

        {/* Right: Auth Buttons */}
        <div className="space-x-2">
          <Button variant="default" className="rounded-full px-4">
            <Link href="/signin">Signin</Link>
          </Button>
          <Button variant="secondary" className="rounded-full px-4">
            <Link href="/signup">Signup</Link>
          </Button>
        </div>
      </nav>
    </header>
  );
}
