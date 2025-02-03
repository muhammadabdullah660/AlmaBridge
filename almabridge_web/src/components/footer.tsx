"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { socialIcons, footerLinks } from "@/data"



export default function Footer() {
  return (
    <footer className="bg-black text-white py-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-bold mb-4 font-space-grotesk">Features</h3>
            <ul className="space-y-2">
              {footerLinks.map((link, index) => (
                <li key={index}>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <h3 className="text-xl font-bold mb-4 font-space-grotesk">Subscribe to our UETALUMNI newsletter</h3>
            <p className="text-gray-400 mb-4">For product announcements and exclusive insights</p>
            <form className="flex space-x-2">
              <Input
                type="email"
                placeholder="Input your email"
                className="bg-white/5 border-white/10 text-white placeholder-gray-500"
              />
              <Button type="submit" className="bg-white text-black hover:bg-white/90">
                Subscribe
              </Button>
            </form>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="lg:ps-5"
          >
            <h3 className="text-xl font-bold mb-4 font-space-grotesk">Connect with us</h3>
            <div className="flex space-x-4">
              {socialIcons.map(({ Icon, href, hoverColor }, index) => (
                <a key={index} href={href} className={`text-gray-400 ${hoverColor} transition-colors duration-200`}>
                  <Icon className="w-6 h-6 hover:text-blue" />
                </a>
              ))}
            </div>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-12 pt-8 border-t border-white/10 text-center text-gray-400"
        >
          <p>&copy; {new Date().getFullYear()} AlmaBridge. All rights reserved.</p>
        </motion.div>
      </div>
    </footer>
  )
}