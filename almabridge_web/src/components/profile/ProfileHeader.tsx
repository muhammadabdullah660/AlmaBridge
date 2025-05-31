"use client"

import type React from "react"

import { memo, useCallback } from "react"
import Image from "next/image"
import { Camera, Edit3 } from "lucide-react"
import { Button } from "../ui/Button"
import { Input } from "../ui/Input"

interface ProfileHeaderProps {
  profilePicture: string
  setProfilePicture: (url: string) => void
  setProfileObject: (file: File) => void
  firstName: string
  lastName: string
  isEditing: boolean
  onToggleEdit: () => void
}

const ProfileHeader = memo(
  ({
    profilePicture,
    setProfilePicture,
    setProfileObject,
    firstName,
    lastName,
    isEditing,
    onToggleEdit,
  }: ProfileHeaderProps) => {
    const handlePictureUpload = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file && file.size <= 5 * 1024 * 1024) {
          const imageUrl = URL.createObjectURL(file)
          setProfilePicture(imageUrl)
          setProfileObject(file)
        } else {
          alert("File size must be less than 5MB.")
        }
      },
      [setProfilePicture, setProfileObject],
    )

    return (
      <div className="flex flex-col sm:flex-row items-center gap-6 bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
        {/* Profile Picture */}
        <div className="relative group">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/20 shadow-xl transition-all duration-300 group-hover:border-blue-400/50">
            <Image
              src={profilePicture || "/placeholder.svg"}
              alt="Profile"
              width={128}
              height={128}
              className="object-cover w-full h-full"
              priority
            />
          </div>

          {isEditing && (
            <>
              <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Camera className="w-6 h-6 text-white" />
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handlePictureUpload}
                  className="absolute top-10 inset-0 opacity-0 cursor-pointer rounded-full"
                />
              </div>
            </>
          )}
        </div>

        {/* Profile Info */}
        <div className="flex-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-4">
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              {firstName} {lastName}
            </h1>
            <Button
              onClick={onToggleEdit}
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-blue-400 hover:bg-blue-400/10 transition-colors duration-200"
            >
              <Edit3 className="w-5 h-5" />
            </Button>
          </div>
          <p className="text-gray-400 mt-2 text-lg">Computer Scientist</p>
          <div className="flex items-center justify-center sm:justify-start gap-2 mt-3">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm text-gray-400">Available for opportunities</span>
          </div>
        </div>
      </div>
    )
  },
)

ProfileHeader.displayName = "ProfileHeader"

export default ProfileHeader
