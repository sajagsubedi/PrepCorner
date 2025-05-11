import React from "react";
import { Button } from "./ui/button";

const footer = () => {
  return (
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
  );
};

export default footer;
