/* eslint-disable @next/next/no-img-element */
"use client"; // This marks the file as a Client Component

import Image from "next/image"; // Import next/image

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start space-y-10 md:space-y-0">
          {/* Left Section - Logo and Language Selector */}
          <div className="flex flex-col items-center md:items-start space-y-4">
            {/* Logo */}
            {/* Use Next.js Image component */}
            <Image src="/assests/logo.png" alt="Logo" width={64} height={64} />

            {/* Language Selector */}
            <div>
              <select className="bg-gray-700 text-white py-2 px-4 rounded-lg border border-gray-600 focus:ring-2 focus:ring-teal-400">
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="ur">Urdu</option>
                {/* Add more languages as needed */}
              </select>
            </div>
          </div>

          {/* Middle Section - Links */}
          <div className="text-center md:text-left">
            <h2 className="text-lg font-semibold mb-6 text-teal-500">
              Features
            </h2>
            <ul className="space-y-3">
              <li>
                <a href="#" className="hover:text-teal-500 transition-colors">
                  All Jobs
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-teal-500 transition-colors">
                  Alumni Highlights
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-teal-500 transition-colors">
                  Community Posts
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-teal-500 transition-colors">
                  Latest Events
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-teal-500 transition-colors">
                  Donate
                </a>
              </li>
            </ul>
          </div>

          {/* Right Section - Newsletter */}
          <div className="text-center md:text-left">
            <h2 className="text-lg font-semibold mb-4 text-teal-500">
              Subscribe to our newsletter
            </h2>
            <p className="mb-4 text-sm">
              For product announcements and exclusive insights
            </p>
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-2 items-center md:items-start">
              <input
                type="email"
                placeholder="Input your email"
                className="py-3 px-4 rounded-md text-black w-full md:w-auto border border-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
              <button className="bg-teal-500 text-white py-3 px-6 rounded-md shadow-lg hover:bg-teal-600 transition-colors">
                Subscribe
              </button>
            </div>

            {/* Social Media Icons */}
            <div className="flex justify-center md:justify-start space-x-6 mt-6">
              <a
                href="https://www.linkedin.com/company/almabridge/"
                target="_blank"
                aria-label="LinkedIn"
                className="hover:opacity-80 transition-opacity"
              >
                <img
                  width="48"
                  height="48"
                  src="https://img.icons8.com/fluency/48/linkedin.png"
                  alt="linkedin"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
