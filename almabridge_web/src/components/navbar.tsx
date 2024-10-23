"use client"; // This marks the file as a Client Component

import { useState } from "react";
import Link from "next/link";
import Image from "next/image"; // Import next/image

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-black text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        {/* Logo Section */}
        <div className="flex items-center">
          <div className="h-16 w-16 flex items-center justify-center">
            {/* Use Next.js Image component */}
            <Image src="/assests/logo.png" alt="Logo" width={64} height={64} />
          </div>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex justify-center flex-1 space-x-8">
          <Link href="#about" legacyBehavior>
            <a className="hover:text-gray-400">About</a>
          </Link>
          <Link href="#faq" legacyBehavior>
            <a className="hover:text-gray-400">FAQ</a>
          </Link>
          <Link href="#team" legacyBehavior>
            <a className="hover:text-gray-400">Team</a>
          </Link>
          <Link href="#features" legacyBehavior>
            <a className="hover:text-gray-400">Features</a>
          </Link>
          <Link href="#highlights" legacyBehavior>
            <a className="hover:text-gray-400">Alumni Highlights</a>
          </Link>
        </div>

        {/* Sign-in/Sign-up Section */}
        <div className="hidden md:flex space-x-4 items-center">
          <Link href="#signin" legacyBehavior>
            <a className="signin">Sign in</a>
          </Link>
          <Link href="#signup" legacyBehavior>
            <a className="signup-button">Sign up</a>
          </Link>
        </div>

        {/* Hamburger Icon for mobile */}
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
      <div className={`${isOpen ? "block" : "hidden"} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link href="#about" legacyBehavior>
            <a className="block px-3 py-2 rounded-md text-base font-medium hover:text-gray-400">
              About
            </a>
          </Link>
          <Link href="#faq" legacyBehavior>
            <a className="block px-3 py-2 rounded-md text-base font-medium hover:text-gray-400">
              FAQ
            </a>
          </Link>
          <Link href="#team" legacyBehavior>
            <a className="block px-3 py-2 rounded-md text-base font-medium hover:text-gray-400">
              Team
            </a>
          </Link>
          <Link href="#features" legacyBehavior>
            <a className="block px-3 py-2 rounded-md text-base font-medium hover:text-gray-400">
              Features
            </a>
          </Link>
          <Link href="#highlights" legacyBehavior>
            <a className="block px-3 py-2 rounded-md text-base font-medium hover:text-gray-400">
              Alumni Highlights
            </a>
          </Link>

          <div className="px-3 py-2">
            <Link href="#signin" legacyBehavior>
              <a className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-gray-400">
                Sign in
              </a>
            </Link>
            <Link href="#signup" legacyBehavior>
              <a className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-gray-400">
                Sign up
              </a>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
