"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/Button"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { roleBasedMenuItems } from "@/data"





export default function AsideMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const pathname = usePathname()
  const [userRole, setUserRole] = useState<"admin" | "student" | "alumni">("student");
  const menuItems = roleBasedMenuItems[userRole];
  
  useEffect(() => {
    setUserRole(getUserRole());
  }, []);
  // Function to get user role from localStorage (browser-only)
  const getUserRole = (): "admin" | "student" | "alumni" => {
    if (typeof window !== "undefined") {
      const role = localStorage.getItem("role") ?? "";
      return (role as "admin" | "student" | "alumni") || "student";
    }
    return "student";
  };

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  return (
    <div className="flex h-screen bg-black text-white">
      {/* Sidebar */}
      <aside
        className={`${
          isMenuCollapsed ? "w-20" : "w-64"
        } bg-black border-r border-white/10 py-4 px-3 hidden md:flex flex-col transition-all duration-300 ease-in-out h-screen`}
      >
        <div className={`flex items-center ${isMenuCollapsed ? "justify-center" : "space-x-3"} mb-3`}>
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
            <Image
              alt="Your Company"
              src="/assets/logo.png"
              width={120}
              height={120}
              className="mx-auto"
            />
          </div>
          {!isMenuCollapsed && <span className="text-lg font-bold">AlmaBridge</span>}
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="self-end mb-3"
          onClick={() => setIsMenuCollapsed(!isMenuCollapsed)}
        >
          <ChevronRight
            className={`w-6 h-6 transition-transform duration-300 ${isMenuCollapsed ? "rotate-0" : "rotate-180"}`}
          />
        </Button>

        <nav className="flex-1 space-y-8 overflow-y-auto pb-2">
          {menuItems.map((section) => (
            <div key={section.category} className="space-y-2">
              {!isMenuCollapsed && <h3 className="text-xs font-semibold text-gray-400 mb-2">{section.category}</h3>}
              <ul className="space-y-1">
                {section.items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className={`flex items-center tooltip ${
                        isMenuCollapsed ? "justify-center" : "space-x-3"
                      } text-gray-400 hover:text-white transition-colors duration-200 p-3 rounded-lg hover:bg-white/5 ${
                        pathname === item.href ? "bg-white/5 text-white" : ""
                      }`}
                    >
                      <item.icon className={`${isMenuCollapsed ? "w-6 h-6" : "w-5 h-5"}`} />
                      <span
                        className={`transition-all duration-300 ease-in-out ${isMenuCollapsed ? "hidden" : "block"}`}
                      >
                        {item.label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </aside>

      {/* Mobile menu button */}
      {!isMenuOpen && isMobile && (
        <button
          className="md:hidden fixed top-3 left-4 z-20 p-2 bg-black rounded-lg border border-white/10"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <Menu className="w-6 h-6 text-white" />
        </button>
      )}

      {/* Mobile menu */}
      {isMobile && (
        <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-10 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-64 bg-black h-full p-6 border-r border-white/10 relative"
              initial={{ x: -100 }}
              animate={{ x: 0 }}
              exit={{ x: -100 }}
            >
              <button
                className="absolute top-4 right-4 p-2 hover:bg-white/5 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                <X className="w-6 h-6" />
              </button>
              {/* Mobile menu content - same as desktop sidebar */}
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <span className="text-xl font-bold text-white">A</span>
                </div>
                <span className="text-lg font-bold">AlmaBridge</span>
              </div>
              <nav className="h-full overflow-y-auto" >
                <ul className="space-y-4">
                  {menuItems.map((section) =>
                    section.items.map((item) => (
                      <li key={item.label}>
                        <Link
                          href={item.href}
                          className="flex items-center space-x-3 text-gray-400 hover:text-white transition-colors duration-200 p-2 rounded-lg hover:bg-white/5"
                        >
                          <item.icon className="w-5 h-5" />
                          <span>{item.label}</span>
                        </Link>
                      </li>
                    )),
                  )}
                </ul>
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      )}
    </div>
  )
}

