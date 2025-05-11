import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/context/AuthProvider";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PrepCorner",
  description: "Ace your entrance exams with confidence",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <Navbar />
          <main className="py-20 bg-gradient-to-br from-green-100 via-blue-100 to-pink-100">
            {children}
          </main>

          <footer className="bg-white/50 backdrop-blur-sm py-4 flex justify-between items-center px-6 text-sm">
            <div className="text-gray-500">
              © Stocy Croustur tr aporpmlno ealog by uebes
            </div>
            <div className="flex items-center space-x-4">
              <a href="#" className="hover:underline">
                Contact
              </a>
              <a href="#" className="hover:underline">
                Terms
              </a>
              <Button className="bg-red-300 text-black px-4 py-1 rounded-full">
                Contact →
              </Button>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
