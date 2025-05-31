"use client"

import { memo, type ReactNode } from "react"

interface SectionCardProps {
  title: string
  icon?: string
  children: ReactNode
}

const SectionCard = memo(({ title, icon, children }: SectionCardProps) => {
  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all duration-200">
      <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
        {icon && <span className="text-2xl">{icon}</span>}
        {title}
      </h2>
      {children}
    </div>
  )
})

SectionCard.displayName = "SectionCard"

export default SectionCard
