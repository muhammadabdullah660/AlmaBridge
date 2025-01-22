"use client"; // Marks the file as a Client Component
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import AchievementsPage from "@/app/achievements/page";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const navItems = [
    { href: "/#", label: "About" },
    { href: "/#faq", label: "FAQ" },
    { href: "/#team", label: "Team" },
    { href: "/#features", label: "Features" },
    { href: "/achievements", label: "Achievements" },
    {href:"/suggestionsPage", label: "Suggestions"},
    {href:"/jobPosting", label: "Jobs"},
  ];

  return (
    <nav className="bg-black text-white sticky top-0 z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        {/* Logo Section */}
        <div className="flex items-center">
          <Image src="/assets/logo.png" alt="Logo" width={112} height={112} />
        </div>

        {/* Navigation Links for Desktop */}
        <div className="hidden md:flex space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hover:text-gray-400"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Sign-in/Sign-up Section */}
        <div className="hidden md:flex space-x-4 items-center">
          <Link
            href="/signin"
            className="text-[#00BDD6] font-bold text-sm lg:text-base transition-colors duration-300"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="bg-[#00BDD6] text-white font-bold text-sm lg:text-base py-2 px-4 rounded-full hover:bg-[#00a9c2] transition duration-300"
          >
            Sign up
          </Link>
        </div>

        {/* Hamburger Icon for Mobile */}
        <div className="md:hidden flex items-center">
          <button
            onClick={toggleMenu}
            type="button"
            className="text-gray-400 hover:text-white focus:outline-none"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`${
          isOpen ? "block" : "hidden"
        } md:hidden bg-black border-t border-gray-700`}
      >
        <div className="px-4 py-3 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block text-gray-300 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
          <div className="pt-4 border-t border-gray-700">
            <Link href="/signin" className="block text-[#00BDD6] font-bold">
              Sign in
            </Link>
            <Link
              href="/signup"
              className="block bg-[#00BDD6] text-white py-2 px-4 rounded-full text-center mt-2"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
