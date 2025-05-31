"use client"

import { memo } from "react"
import { Input } from "../ui/Input"
import { Textarea } from "../ui/Textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/Select"
import { gender } from "@/data"
import type { ProfileData } from "@/types"
import SectionCard from "./SectionCard"

interface PersonalInfoProps {
  profileData: ProfileData
  isEditing: boolean
  onUpdate: (updates: Partial<ProfileData>) => void
}

const PersonalInfo = memo(({ profileData, isEditing, onUpdate }: PersonalInfoProps) => {
  const handleChange = (field: keyof ProfileData, value: string) => {
    onUpdate({ [field]: value })
  }

  return (
    <SectionCard title="Personal Information" icon="👤">
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">First Name</label>
            {isEditing ? (
              <Input
                value={profileData.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                placeholder="Enter first name"
              />
            ) : (
              <p className="text-white">{profileData.firstName || "Not specified"}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Last Name</label>
            {isEditing ? (
              <Input
                value={profileData.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
                placeholder="Enter last name"
              />
            ) : (
              <p className="text-white">{profileData.lastName || "Not specified"}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Primary Email</label>
          <Input value={profileData.primaryEmail} disabled className="opacity-60" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Secondary Email</label>
          {isEditing ? (
            <Input
              value={profileData.secondaryEmail}
              onChange={(e) => handleChange("secondaryEmail", e.target.value)}
              placeholder="Enter secondary email"
            />
          ) : (
            <p className="text-white">{profileData.secondaryEmail || "Not specified"}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Address</label>
          {isEditing ? (
            <Input
              value={profileData.address}
              onChange={(e) => handleChange("address", e.target.value)}
              placeholder="Enter address"
            />
          ) : (
            <p className="text-white">{profileData.address || "Not specified"}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Gender</label>
          {isEditing ? (
            <Select onValueChange={(value) => handleChange("gender", value)} value={profileData.gender}>
              <SelectTrigger>
                <SelectValue placeholder="Select Gender" />
              </SelectTrigger>
              <SelectContent>
                {gender.map((gen) => (
                  <SelectItem key={gen} value={gen}>
                    {gen}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <p className="text-white">{profileData.gender || "Not specified"}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
          {isEditing ? (
            <Textarea
              value={profileData.bio}
              onChange={(e) => handleChange("bio", e.target.value)}
              placeholder="Tell us about yourself..."
              rows={4}
            />
          ) : (
            <p className="text-white">{profileData.bio || "No bio available"}</p>
          )}
        </div>
      </div>
    </SectionCard>
  )
})

PersonalInfo.displayName = "PersonalInfo"

export default PersonalInfo
