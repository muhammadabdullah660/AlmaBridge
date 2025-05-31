"use client"

import { memo } from "react"
import { ExternalLink } from "lucide-react"
import { Input } from "../ui/Input"
import type { ProfileData } from "@/types"
import SectionCard from "./SectionCard"

interface SocialLinksProps {
  profileData: ProfileData
  isEditing: boolean
  onUpdate: (updates: Partial<ProfileData>) => void
}

const SocialLinks = memo(({ profileData, isEditing, onUpdate }: SocialLinksProps) => {
  const handleChange = (field: keyof ProfileData, value: string) => {
    onUpdate({ [field]: value })
  }

  const links = [
    { key: "linkedin" as keyof ProfileData, label: "LinkedIn", icon: "💼" },
    { key: "portfolio" as keyof ProfileData, label: "Portfolio", icon: "🌐" },
    { key: "linktree" as keyof ProfileData, label: "Linktree", icon: "🔗" },
  ]

  return (
    <SectionCard title="Social Links" icon="🔗">
      <div className="space-y-6">
        {links.map(({ key, label, icon }) => (
          <div key={key}>
            <label className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
              <span>{icon}</span>
              {label}
            </label>
            {isEditing ? (
              <Input
                value={profileData[key] as string}
                onChange={(e) => handleChange(key, e.target.value)}
                placeholder={`Enter your ${label.toLowerCase()} URL`}
              />
            ) : (
              <div className="flex items-center gap-2">
                {profileData[key] ? (
                  <a
                    href={profileData[key] as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 transition-colors duration-200 flex items-center gap-2"
                  >
                    {profileData[key] as string}
                    <ExternalLink className="w-4 h-4" />
                  </a>
                ) : (
                  <p className="text-gray-400">Not specified</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </SectionCard>
  )
})

SocialLinks.displayName = "SocialLinks"

export default SocialLinks
