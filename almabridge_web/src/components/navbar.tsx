"use client"

import { useState, useEffect } from "react"
import { motion, useScroll } from "framer-motion"
import { Button } from "@/components/ui/Button"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const { scrollY } = useScroll()

  const router = useRouter();
  
  const navigateTo = (path: string): void => {
    if (isClient) {
      router.push(path);
    }
  }

  useEffect(() => {
    setIsClient(true);
    const unsubscribe = scrollY.on("change", (latest) => {
      setIsScrolled(latest > 50)
    })
    return () => unsubscribe()
  }, [scrollY])

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "backdrop-blur-md bg-black/50" : ""
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <motion.div
            className="flex-shrink-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-12 h-12 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                {/* <span className="text-2xl font-bold text-white">A</span> */}
                <Image
                    alt="Your Company"
                    src="/assets/logo.webp"
                    width={120}
                    height={120}
                    className="mx-auto"
                />
              </div>
              <span className="text-xl font-bold text-white">AlmaBridge</span>
            </Link>
          </motion.div>

          <div className="hidden md:block">
            <motion.div
              className="flex space-x-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {["Features", "Team", "Metrics", "FAQ's"].map((item) => (
                <Link
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  {item}
                </Link>
              ))}
            </motion.div>
          </div>

          <motion.div
            className="hidden md:flex items-center space-x-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Button onClick={() => navigateTo('/sign-in')} variant="ghost" className="text-white hover:text-white hover:bg-white/10">
              Sign In
            </Button>
            <Button onClick={() => navigateTo('/sign-up')} className="bg-white text-black hover:bg-white/90">Sign Up</Button>
          </motion.div>
        </div>
      </div>
    </motion.nav>
  )
}

