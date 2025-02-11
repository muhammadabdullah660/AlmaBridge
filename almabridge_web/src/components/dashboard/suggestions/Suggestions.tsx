/* eslint-disable @next/next/no-img-element */
"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
// import Image from "next/image";
import { useEffect, useState } from "react";
import { GetAllSuggestions } from "@/lib/api/suggestionsService";
import { AlumniSuggestions } from "@/types";
function TeamMemberCard({ member }: { member: AlumniSuggestions }) {
  const [isHovered, setIsHovered] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(
    mouseYSpring,
    [-0.5, 0.5],
    ["17.5deg", "-17.5deg"]
  );
  const rotateY = useTransform(
    mouseXSpring,
    [-0.5, 0.5],
    ["-17.5deg", "17.5deg"]
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => {
        setIsHovered(false);
        x.set(0);
        y.set(0);
      }}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        boxShadow: isHovered ? "0 0 20px rgba(255, 255, 255, 0.1)" : "none",
      }}
      className="relative group"
    >
      <div className="relative p-6 rounded-lg bg-white/10 backdrop-blur-xl h-[400px] border border-white/20 transition-all duration-300 flex flex-col items-center justify-between transform-style-3d hover:bg-white/15 hover:border-white/30 perspective-[1000px]">
        <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-blue-500 border-4">
          <img
            src={member.image_url || "/assets/placeholder.svg"}
            alt={member.name}
            width={128}
            height={128}
            className="object-cover"
          />
        </div>
        <h3 className="text-xl font-semibold mb-2 text-white font-space-grotesk text-center leading-tight line-clamp-2">
          {member.name}
        </h3>
        <p className="text-gray-400 text-sm mb-4 text-center line-clamp-2">
          {member.headline}
        </p>
        <p className="text-xs text-gray-500 text-center line-clamp-6">
          {member.about}
        </p>
      </div>
    </motion.div>
  );
}

export default function Suggestions() {
  const [suggestions, setSuggestions] = useState<AlumniSuggestions[]>([]);
  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const suggestions = await GetAllSuggestions();
        console.log(suggestions);
        setSuggestions(suggestions);
      } catch (error) {
        console.log(error);
      }
    };
    fetchSuggestions();
  }, []);
  return (
    <section id="team" className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/50 to-black" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6 font-space-grotesk">
            Meet Our <span className="text-glow">Alumni</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            Dedicated professionals committed to revolutionizing mentorship and
            education.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {suggestions.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <TeamMemberCard member={member} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Decorative Elements */}
      <motion.div
        className="absolute top-1/4 left-10 w-20 h-20 border border-white/10 rounded-full"
        animate={{
          scale: [1, 1.2, 1],
          rotate: 360,
        }}
        transition={{
          duration: 10,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-10 w-32 h-32 border border-white/10 rounded-full"
        animate={{
          scale: [1, 1.3, 1],
          rotate: -360,
        }}
        transition={{
          duration: 15,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      />
    </section>
  );
}
