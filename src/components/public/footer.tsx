import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="body-font bg-gray-100 min-h-80 flex flex-col justify-between mt-20">
      <div className="flex flex-col items-center gap-5 md:flex-row">
        <div className="px-10 py-3 flex items-start flex-col md:w-1/2 gap-5 ">
          <div className="flex flex-col items-center">
            <Link
              className="flex title-font font-medium items-center md:justify-start w-full justify-center text-gray-900"
              href="/"
            >
              <Image
                src="/assets/logo.png"
                className="w-60 md:w-[300px] shadow-3xl shadow-gray-100"
                alt="logo"
                width={100}
                height={100}
              />
            </Link>
            <p className="mt-2 text-sm text-gray-900 text-center md:text-left">
              Skip the stress and sharpen your skills! With PrepCorner, exam
              success is just a tap away—focused, fast, and built to boost your
              confidence every step of the way.
            </p>
          </div>
          <div className="flex flex-col w-full gap-1">
            <h2 className="text-xl text-gray-800 mb-2 mt-4 font-bold">
              Contact Us
            </h2>
            <p className="text-gray-900">Pokhara-11,Fulbari,Kaski</p>
            <p className="text-gray-900">
              <b>Email:</b>sajagsubedi03@gmail.com
            </p>
            <p className="text-gray-900">
              <b>Phone:</b>9769495964
            </p>
            <div className="flex gap-3 m-2">
              <a href="https://www.facebook.com/sajagsubedi3">
                <Facebook className="text-2xl text-gray-800" />
              </a>
              <a href="https://www.instagram.com/sajagsubedi/">
                <Instagram className="text-2xl text-gray-800" />
              </a>
              <a href="https://x.com/sajag_subedi">
                <Twitter className="text-2xl text-gray-800" />
              </a>
              <a href="https://www.youtube.com/@sajagsubedi">
                <Youtube className="text-2xl text-gray-800" />
              </a>
            </div>
          </div>
        </div>
        <div className="md:w-1/2 flex flex-row">
          <div className="flex-col w-1/2 flex gap-3">
            <h3 className="font-medium text-lg text-gray-600">Links</h3>
            <ul className="flex flex-col py-2 gap-2 px-4 items-start text-gray-600">
              <li className="list-disc">
                <Link href="/" className="hover:text-primary-500">
                  Home
                </Link>
              </li>
              <li className="list-disc">
                <Link href="/menu" className="hover:text-primary-500">
                  About
                </Link>
              </li>
              <li className="list-disc">
                <Link href="/services" className="hover:text-primary-500">
                  Services
                </Link>
              </li>
              <li className="list-disc">
                <Link href="/contact" className="hover:text-primary-500">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          <div className="flex-col w-1/2 flex gap-3">
            <h3 className="font-medium text-lg text-gray-600">Useful Links</h3>
            <ul className="flex flex-col gap-2 items-start text-gray-600 py-2 px-5 ">
              <li className="list-disc">
                <Link href="/" className="hover:text-primary-500">
                  Forex
                </Link>
              </li>
              <li className="list-disc">
                <Link href="/" className="hover:text-primary-500">
                  Privacy Policy
                </Link>
              </li>
              <li className="list-disc">
                <Link href="/" className="hover:text-primary-500">
                  Terms and Conditions
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="w-full bg-gray-900 h-16 text-wrap text-center px-5 py-2 mt-6">
        <p className="text-gray-300">
          Copyright &copy; 2025 PrepCorner. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
