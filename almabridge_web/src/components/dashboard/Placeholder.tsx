"use client"

import { motion } from "framer-motion"
import { Frown, Lightbulb } from "lucide-react"

export default function Placeholder() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <Frown className="w-24 h-24 text-gray-400 mb-6" />
      </motion.div>
      <motion.h2
        className="text-3xl font-bold mb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        Oops! This page is still under construction
      </motion.h2>
      <motion.p
        className="text-xl text-gray-400 mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        We&apos;re working hard to bring you something amazing. Please check back later!
      </motion.p>
      <motion.div
        className="flex items-center text-yellow-400"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Lightbulb className="w-6 h-6 mr-2" />
        <p className="text-lg font-semibold">Fun fact: Rome wasn&apos;t built in a day, but this page might be!</p>
      </motion.div>
    </div>
  )
}

