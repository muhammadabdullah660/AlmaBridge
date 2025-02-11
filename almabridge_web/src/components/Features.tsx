"use client"

import { motion } from "framer-motion"
import { features } from "@/data"

export default function Features() {
  return (
    <section id="features" className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/50 to-black" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6 font-space-grotesk">Empowering Features</h2>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            Discover the tools and features that make AlmaBridge the leading platform for academic and professional
            growth.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-white/5 rounded-lg blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100" />
              <div className="relative p-6 rounded-lg bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-colors duration-300 h-64 w-full flex flex-col">
                <div className="w-12 h-12 rounded-lg bg-white/10 p-2 mb-6">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-white font-space-grotesk">{feature.title}</h3>
                <p className="text-gray-400 line-clamp-3">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

