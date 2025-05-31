"use client"

import { useState, useEffect, useCallback, memo } from "react"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"
import type { ProfileData } from "@/types"
import { UpdateProfile } from "@/lib/api/profileService"
import { ResumeParser } from "@/lib/api/resumeService"
import ProfileHeader from "./ProfileHeader"
import PersonalInfo from "./PersonalInfo"
import SocialLinks from "./SocialLinks"
import WorkExperience from "./WorkExperience"
import Education from "./Education"
import Certifications from "./Certifications"
import Skills from "./Skills"
import ResumeSection from "./ResumeSection"
import { Button } from "../ui/Button"

const ProfileForm = memo(() => {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [profilePicture, setProfilePicture] = useState("/assets/Default_pfp.jpg")
  const [profileObject, setProfileObject] = useState<File>()

  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: "",
    lastName: "",
    primaryEmail: "",
    secondaryEmail: "",
    address: "",
    aboutMe: "",
    bio: "",
    gender: "",
    education: [],
    workExperience: [],
    skills: [],
    certification: [],
    portfolio: "",
    linkedin: "",
    linktree: "",
  })

  const fetchUser = useCallback(() => {
    try {
      const userFirstName = localStorage.getItem("firstName") ?? "";
      const userLastName = localStorage.getItem("lastName") ?? "";
      const userEmail = localStorage.getItem("email") ?? "";
      
      setProfileData((prev) => ({
        ...prev,
        firstName: userFirstName,
        lastName: userLastName,
        primaryEmail: userEmail,
      }));
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to load user profile");
    }
  }, []);

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  const toggleEdit = useCallback(() => {
    setIsEditing((prev) => !prev)
  }, [])

  const updateProfileData = useCallback((updates: Partial<ProfileData>) => {
    setProfileData((prev) => ({ ...prev, ...updates }))
  }, [])

  const handleResumeUpload = useCallback(async (file: File) => {
  try {
    const parsedData = await ResumeParser(file);
    console.log('Parsed resume data:', parsedData);

    setProfileData((prev) => ({
      ...prev,
      firstName: parsedData.Name?.split(' ')[0] || prev.firstName,
      lastName: parsedData.Name?.split(' ').slice(1).join(' ') || prev.lastName,
      primaryEmail: parsedData.Email || prev.primaryEmail,
      address: parsedData.Address || prev.address,
      workExperience:
        parsedData['Work Experience']?.map((exp) => ({
          company: exp.Company,
          role: exp.Title,
          startDate: exp.Dates?.split('–')[0]?.trim() || '',
          endDate: exp.Dates?.split('–')[1]?.trim() || 'Present',
          description: exp.Description,
        })) || prev.workExperience,
      skills: [
        ...(parsedData.Skills?.Languages?.map((lang) => ({ name: lang, rating: 5 })) || []),
        ...(parsedData.Skills?.Frameworks?.map((fw) => ({ name: fw, rating: 5 })) || []),
        ...(parsedData.Skills?.Libraries?.map((lib) => ({ name: lib, rating: 5 })) || []),
        ...(parsedData.Skills?.['Developer Tools']?.map((tool) => ({ name: tool, rating: 5 })) || []),
      ],
      education:
        parsedData.Education?.map((edu) => ({
          school: edu.Institution || '',
          degree: edu.Degree || '',
          fieldOfStudy: '',
          graduationYear: edu.Dates?.split('–')[1]?.trim() || '',
        })) || prev.education,
      certification:
        parsedData.Certifications?.map((cert) => ({
          name: cert.name,
          issuer: cert.issuer || '',
          date: cert.date || '',
        })) || prev.certification,
    }));

    toast.success('Resume uploaded and parsed successfully');
  } catch (error) {
    console.error('Error uploading resume:', error);
    toast.error('Failed to parse resume');
  }
}, []);

  const updateUserProfile = useCallback(async () => {
    try {
      setIsLoading(true)
      const formData = new FormData()

      // Append text fields
      const textFields: (keyof ProfileData)[] = [
        "firstName",
        "lastName",
        "address",
        "aboutMe",
        "linkedin",
        "bio",
        "gender",
        "secondaryEmail",
        "portfolio",
        "linktree",
      ]

      textFields.forEach((field) => {
        const value = profileData[field]
        if (typeof value === "string") {
          formData.append(field, value)
        }
      })

      // Append arrays
      profileData.education.forEach((edu, index) => {
        Object.entries(edu).forEach(([key, value]) => {
          formData.append(`education[${index}][${key}]`, value || "")
        })
      })

      profileData.workExperience.forEach((exp, index) => {
        Object.entries(exp).forEach(([key, value]) => {
          formData.append(`experiences[${index}][${key}]`, value || "")
        })
      })

      profileData.skills.forEach((skill, index) => {
        formData.append(`skills[${index}][skillName]`, skill.name)
        formData.append(`skills[${index}][rating]`, skill.rating.toString())
      })

      profileData.certification.forEach((cert, index) => {
        Object.entries(cert).forEach(([key, value]) => {
          formData.append(`certifications[${index}][${key}]`, value || "")
        })
      })

      if (profileObject) {
        formData.append("file", profileObject)
      }

      const message = await UpdateProfile(formData)
      console.log(message)
      toast.success("Profile updated successfully!")
      setIsEditing(false)
      router.push("/dashboard")
    } catch (error) {
      console.error("Error updating user profile:", error)
      toast.error("Failed to update profile")
    } finally {
      setIsLoading(false)
    }
  }, [profileData, profileObject, router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Hero Section */}
      <div className="relative h-64 bg-gradient-to-r from-blue-600 via-purple-600 to-teal-500 overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </div>

      {/* Main Content */}
      <div className="relative -mt-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <ProfileHeader
          profilePicture={profilePicture}
          setProfilePicture={setProfilePicture}
          setProfileObject={setProfileObject}
          firstName={profileData.firstName || ""}
          lastName={profileData.lastName || ""}
          isEditing={isEditing}
          onToggleEdit={toggleEdit}
        />

        <div className="mt-8 space-y-8">
          <ResumeSection isEditing={isEditing} onResumeUpload={handleResumeUpload} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <PersonalInfo profileData={profileData} isEditing={isEditing} onUpdate={updateProfileData} />

            <SocialLinks profileData={profileData} isEditing={isEditing} onUpdate={updateProfileData} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <WorkExperience
              workExperience={profileData.workExperience}
              isEditing={isEditing}
              onUpdate={(workExperience) => updateProfileData({ workExperience })}
            />

            <Education
              education={profileData.education}
              isEditing={isEditing}
              onUpdate={(education) => updateProfileData({ education })}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Certifications
              certifications={profileData.certification}
              isEditing={isEditing}
              onUpdate={(certification) => updateProfileData({ certification })}
            />

            <Skills
              skills={profileData.skills}
              isEditing={isEditing}
              onUpdate={(skills) => updateProfileData({ skills })}
            />
          </div>

          {isEditing && (
            <div className="flex justify-center pb-8">
              <Button
                onClick={updateUserProfile}
                disabled={isLoading}
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white font-semibold rounded-lg transition-all duration-200 hover:scale-105 shadow-lg"
              >
                {isLoading ? "Saving Changes..." : "Save Changes"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
})

ProfileForm.displayName = "ProfileForm"

export default ProfileForm
