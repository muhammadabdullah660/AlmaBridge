"use client"

import { useCallback, useEffect, useState } from "react"
import { motion } from "framer-motion"
import { PencilLine, ChevronRight, Send, Linkedin, Wand, Globe, Briefcase, Plus, Trash2, GraduationCap, Code } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import Image from "next/image"
import Link from "next/link"
import type { Education, ProfileData, WorkExperience } from "@/types"
import { getUserProfileData, UpdateProfile } from "@/lib/api/profileService"
import { gender } from "@/data"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import { Textarea } from "@/components/ui/Textarea"

const ProfileForm: React.FC = () => {
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
    });

    const fetchUser = useCallback(async () => {
        try {
            const data = await getUserProfileData();
    
            setProfileData((prev) => ({
                ...prev,
                firstName: data.firstName,
                lastName: data.lastName,
                primaryEmail: data.email,
                address: data.profile?.address || "",
                workExperience: data.profile?.experiences || [],
                secondaryEmail: data.profile?.secondaryEmail || "",
                certification: data.profile?.certificates || [],
                linkedin: data.profile?.linkedin || "",
                linktree: data.profile?.linktree || "",
                gender: data.profile?.gender || "",
                bio: data.profile?.bio || "",
                skills: data.profile?.skills?.map((skill) => ({
                    name: skill.skillName,
                    rating: skill.rating,
                })) || [],
                education: data.profile?.educations?.map((edu) => ({
                    school: edu.school,
                    degree: edu.degree,
                    fieldOfStudy: edu.fieldOfStudy,
                    graduationYear: edu.graduationYear,
                })) || [],
            }));
    
            setProfilePicture(data.profile?.profileImage || "/assets/placeholder.svg");
    
        } catch (error) {
            console.error("Failed to Load User Data:", error);
        }
    }, []);
    
    useEffect(() => {
        fetchUser();
    }, [fetchUser]);


  const toggleEdit = () => {
    setIsEditing(!isEditing)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value })
  }

  const handlePictureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfilePicture(reader.result as string)
        setProfileObject(file)
      }
      reader.readAsDataURL(file)
    }
  }

  const updateUserProfile = async () => {
    setIsLoading(true);
    try{
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
      setIsEditing(false)
    } catch(error) {
      console.error("Error updating user profile:", error)
    } finally {
      setIsLoading(false)
    }

  }


    const addEducationField = () => {
        setProfileData({
        ...profileData,
        education: [
            ...profileData.education,
            { school: "", degree: "", fieldOfStudy: "", graduationYear: "" },
        ],
        })
    }

    const updateEducationField = (
        index: number,
        field: keyof Education,
        value: string
    ) => {
        const updatedEducation = [...profileData.education];
        updatedEducation[index] = {
            ...updatedEducation[index],
            [field]: value,
        };
        setProfileData({ ...profileData, education: updatedEducation });
    };

    const removeEducation = (index: number) => {
        const updatedEducation = profileData.education.filter(
        (_, i) => i !== index
        );
        setProfileData({ ...profileData, education: updatedEducation });
    };

    const addWorkExperienceField = () => {
        setProfileData({
        ...profileData,
        workExperience: [
            ...profileData.workExperience,
            { company: "", role: "", startDate: "", endDate: "", description: "" },
        ],
        });
    };

    const updateWorkExperienceField = (
        index: number,
        field: keyof WorkExperience,
        value: string
    ) => {
        const updatedWorkExperience = [...profileData.workExperience];
        updatedWorkExperience[index] = {
        ...updatedWorkExperience[index],
        [field]: value,
        };
        setProfileData({ ...profileData, workExperience: updatedWorkExperience });
    };

    const removeWorkExperience = (index: number) => {
        const updatedWorkExperience = profileData.workExperience.filter(
        (_, i) => i !== index
        );
        setProfileData((prev) => ({
        ...prev,
        workExperience: updatedWorkExperience,
        }));
    };

    // const addCertificationField = () => {
    //     setProfileData({
    //     ...profileData,
    //     certification: [
    //         ...profileData.certification,
    //         { name: "", issuer: "", date: "" },
    //     ],
    //     });
    // };


    // const updateCertificationField = (
    //     index: number,
    //     field: keyof Certification,
    //     value: string
    // ) => {
    //     const updatedCertification = [...profileData.certification];
    //     updatedCertification[index] = {
    //     ...updatedCertification[index],
    //     [field]: value,
    //     };
    //     setProfileData({ ...profileData, certification: updatedCertification });
    // };
    
    // const removeCertification = (index: number) => {
    //     const updatedCertification = profileData.certification.filter(
    //     (_, i) => i !== index
    //     );
    //     setProfileData((prev) => ({
    //     ...prev,
    //     certifications: updatedCertification,
    //     }));
    // };

    const addSkill = () => {
        setProfileData({
        ...profileData,
        skills: [...profileData.skills, { name: "", rating: 5 }],
        });
    };

    const removeSkill = (index: number) => {
        const updatedSkills = profileData.skills.filter((_, i) => i !== index);
        setProfileData({ ...profileData, skills: updatedSkills });
    };

    const handleSkillNameChange = (index: number, newName: string) => {
        const updatedSkills = [...profileData.skills];
        updatedSkills[index].name = newName;
        setProfileData({ ...profileData, skills: updatedSkills });
    };

    const handleRatingChange = (index: number, newRating: number) => {
        const updatedSkills = [...profileData.skills];
        updatedSkills[index].rating = newRating;
        setProfileData({ ...profileData, skills: updatedSkills });
    };


  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-gray-400">
        <Link href="/dashboard" className="hover:text-white transition-colors">
          Dashboard
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-white">Profile</span>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Your Profile</h1>
          <p className="text-gray-400">Manage your personal information and credentials</p>
        </div>
        <Button onClick={toggleEdit} className="bg-purple-600 hover:bg-purple-700 text-white">
          {isEditing ? "Cancel Editing" : "Edit Profile"}
        </Button>
      </div>

      {/* Profile Picture & Basic Info */}
      <div className="bg-white/5 rounded-lg p-6 border border-white/10">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden">
              <Image
                src={profilePicture || "/placeholder.svg"}
                alt="Profile Picture"
                width={128}
                height={128}
                className="object-cover"
              />
            </div>
            {isEditing && (
              <label
                htmlFor="profile-picture-upload"
                className="absolute bottom-0 right-0 bg-purple-600 text-white p-2 rounded-full cursor-pointer hover:bg-purple-700 transition-colors"
              >
                <PencilLine size={16} />
                <input
                  id="profile-picture-upload"
                  type="file"
                  accept="image/*"
                  onChange={handlePictureUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2">
              {profileData.firstName} {profileData.lastName}
            </h2>
            <p className="text-gray-400 mb-4">Computer Scientist</p>
            {isEditing ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  type="text"
                  name="firstName"
                  value={profileData.firstName}
                  onChange={handleChange}
                  placeholder="First Name"
                />
                <Input
                  type="text"
                  name="lastName"
                  value={profileData.lastName}
                  onChange={handleChange}
                  placeholder="Last Name"
                />
                <Input
                  type="text"
                  name="address"
                  value={profileData.address}
                  onChange={handleChange}
                  placeholder="Current Address"
                />
                <Input
                  type="text"
                  name="secondaryEmail"
                  value={profileData.secondaryEmail}
                  onChange={handleChange}
                  placeholder="Secondary Email"
                />
                <Select onValueChange={(value) => setProfileData({ ...profileData, gender: value })} value={profileData.gender}>
                    <SelectTrigger>
                        <SelectValue placeholder={profileData.gender !== "" ? profileData.gender : "Select Gender"} />
                    </SelectTrigger>
                    <SelectContent>
                        {gender.map((gen) => (
                            <SelectItem key={gen} value={gen}>
                            {gen}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-gray-400">Email</Label>
                  <p>{profileData.primaryEmail}</p>
                </div>
                <div>
                  <Label className="text-gray-400">Secondary Email</Label>
                  <p>{profileData.secondaryEmail !== "" ? profileData.secondaryEmail : "None"}</p>
                </div>
                <div>
                  <Label className="text-gray-400">Location</Label>
                  <p>{profileData.address || "Not specified"}</p>
                </div>
                <div>
                  <Label className="text-gray-400">Gender</Label>
                  <p>{profileData.gender || "None"}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* About Me */}
      <div className="bg-white/5 rounded-lg p-6 border border-white/10">
        <h2 className="text-xl font-bold mb-4">About Me</h2>
        {isEditing ? (
          <Textarea
            name="bio"
            value={profileData.bio}
            onChange={handleChange}
            placeholder="Tell us about yourself"
          />
        ) : (
          <p className="text-gray-300">{profileData.bio}</p>
        )}
      </div>


      {/* Social Media Links */}
      <div className="bg-white/5 rounded-lg p-6 border border-white/10">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <Send className="mr-2" />
          Social Media & Portfolio
        </h2>
        {isEditing ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="linkedin">LinkedIn</Label>
              <Input
                id="linkedin"
                name="linkedin"
                value={profileData.linkedin}
                onChange={handleChange}
                placeholder="LinkedIn URL"
              />
            </div>
            <div>
              <Label htmlFor="linktree">Linktree</Label>
              <Input
                id="linktree"
                name="linktree"
                value={profileData.linktree}
                onChange={handleChange}
                placeholder="Linktree URL"
              />
            </div>
            <div>
              <Label htmlFor="portfolio">Portfolio</Label>
              <Input
                id="portfolio"
                name="portfolio"
                value={profileData.portfolio}
                onChange={handleChange}
                placeholder="Portfolio URL"
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href={profileData.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-blue-400 hover:text-blue-300 w-fit"
            >
              <Linkedin className="mr-2" size={20} />
              LinkedIn Profile
            </a>
            <a
              href={profileData.linktree}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-green-400 hover:text-green-300 w-fit"
            >
              <Wand className="mr-2" size={20} />
              Linktree
            </a>
            <a
              href={profileData.portfolio}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-purple-400 hover:text-purple-300 w-fit"
            >
              <Globe className="mr-2" size={20} />
              Portfolio Website
            </a>
          </div>
        )}
      </div>




      {/* Work Experience */}
      <div className="bg-white/5 rounded-lg p-6 border border-white/10">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <Briefcase className="mr-2" />
          Work Experience
        </h2>
        {profileData.workExperience.map((experience, index) => (
          <div key={index} className="mb-6 last:mb-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {isEditing ? (
                <>
                  <div className="mb-2">
                    <Label htmlFor={`company-${index}`}>Company</Label>
                    <Input
                      id={`company-${index}`}
                      type="text"
                      name="company"
                      value={experience.company}
                      onChange={(e) => updateWorkExperienceField(index, "company", e.target.value)}
                      placeholder="e.g., ABC Corp"
                    />
                  </div>
                  <div className="mb-2">
                    <Label htmlFor={`role-${index}`}>Role</Label>
                    <Input
                      id={`role-${index}`}
                      type="text"
                      name="role"
                      value={experience.role}
                      onChange={(e) => updateWorkExperienceField(index, "role", e.target.value)}
                      placeholder="e.g., Software Engineer"
                    />
                  </div>
                  <div className="flex gap-4 mb-2">
                    <div className="flex-1">
                      <Label htmlFor={`startDate-${index}`}>Start Date</Label>
                      <Input
                        id={`startDate-${index}`}
                        type="text"
                        name="startDate"
                        value={experience.startDate}
                        placeholder="Format (Month - Year)"
                        onChange={(e) => updateWorkExperienceField(index, "startDate", e.target.value)}
                      />
                    </div>
                    <div className="flex-1">
                      <Label htmlFor={`endDate-${index}`}>End Date</Label>
                      <Input
                        id={`endDate-${index}`}
                        type="text"
                        name="endDate"
                        value={experience.endDate}
                        onChange={(e) => updateWorkExperienceField(index, "endDate", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="mb-2 col-span-2">
                    <Label htmlFor={`description-${index}`}>Description</Label>
                    <Textarea
                      id={`description-${index}`}
                      name="description"
                      value={experience.description}
                      onChange={(e) => updateWorkExperienceField(index, "description", e.target.value)}
                      placeholder="e.g., Developed and maintained web applications..."
                    />
                  </div>
                  <div className="col-span-2 flex justify-end">
                    <Button variant="destructive" size="sm" onClick={() => removeWorkExperience(index)}>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                </>
              ) : (
                <div className="col-span-2">
                  <h3 className="text-lg font-semibold">{experience.role}</h3>
                  <p className="text-gray-400">{experience.company}</p>
                  <p className="text-sm text-gray-500">
                    {experience.startDate} - {experience.endDate}
                  </p>
                  <p className="mt-2 text-gray-300 whitespace-pre-line">{experience.description}</p>
                </div>
              )}
            </div>
          </div>
        ))}
        {isEditing && (
          <Button onClick={addWorkExperienceField} className="mt-4">
            <Plus className="w-4 h-4 mr-2" />
            Add Work Experience
          </Button>
        )}
      </div>

      {/* Education */}
      <div className="bg-white/5 rounded-lg p-6 border border-white/10">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <GraduationCap className="mr-2" />
          Education
        </h2>
        {profileData.education.map((education, index) => (
          <div key={index} className="mb-6 last:mb-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {isEditing ? (
                <>
                  <div className="mb-2">
                    <Label htmlFor={`school-${index}`}>School</Label>
                    <Input
                      id={`school-${index}`}
                      type="text"
                      name="school"
                      value={education.school}
                      onChange={(e) => updateEducationField(index, "school", e.target.value)}
                      placeholder="e.g., University of Engineering and Technology"
                    />
                  </div>
                  <div className="mb-2">
                    <Label htmlFor={`degree-${index}`}>Degree</Label>
                    <Input
                      id={`degree-${index}`}
                      type="text"
                      name="degree"
                      value={education.degree}
                      onChange={(e) => updateEducationField(index, "degree", e.target.value)}
                      placeholder="e.g., Bachelor's of Computer Science"
                    />
                  </div>
                  <div className="mb-2">
                    <Label htmlFor={`fieldOfStudy-${index}`}>Field of Study</Label>
                    <Input
                      id={`fieldOfStudy-${index}`}
                      type="text"
                      name="fieldOfStudy"
                      value={education.fieldOfStudy}
                      onChange={(e) => updateEducationField(index, "fieldOfStudy", e.target.value)}
                      placeholder="e.g., Computer Sciences"
                    />
                  </div>
                  <div className="mb-2">
                    <Label htmlFor={`graduationYear-${index}`}>Graduation Year</Label>
                    <Input
                      id={`graduationYear-${index}`}
                      type="text"
                      name="graduationYear"
                      value={education.graduationYear}
                      onChange={(e) => updateEducationField(index, "graduationYear", e.target.value)}
                      placeholder="e.g., 2024"
                    />
                  </div>
                  <div className="col-span-2 flex justify-end">
                    <Button variant="destructive" size="sm" onClick={() => removeEducation(index)}>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                </>
              ) : (
                <div className="col-span-2">
                  <h3 className="text-lg font-semibold">{education.school}</h3>
                  <p className="text-gray-400">
                    {education.degree} in {education.fieldOfStudy}
                  </p>
                  <p className="text-sm text-gray-500">Graduation Year: {education.graduationYear}</p>
                </div>
              )}
            </div>
          </div>
        ))}
        {isEditing && (
          <Button onClick={addEducationField} className="mt-4">
            <Plus className="w-4 h-4 mr-2" />
            Add Education
          </Button>
        )}
      </div>

      {/* Skills */}
      <div className="bg-white/5 rounded-lg p-6 border border-white/10">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <Code className="mr-2" />
          Skills
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {profileData.skills.map((skill, index) => (
            <div key={index} className="flex items-center">
              {isEditing ? (
                <>
                  <Input
                    type="text"
                    value={skill.name}
                    onChange={(e) => handleSkillNameChange(index, e.target.value)}
                    placeholder="Skill name"
                    className="mr-2"
                  />
                  <Input
                    type="number"
                    value={skill.rating}
                    onChange={(e) => handleRatingChange(index, Number.parseInt(e.target.value))}
                    min="1"
                    max="5"
                    className="w-16 mr-2"
                  />
                  <Button variant="destructive" size="sm" onClick={() => removeSkill(index)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </>
              ) : (
                <div className="grid grid-cols-2 items-center gap-4 w-full">
                    <span className="text-sm">{skill.name}</span>
                    <div className="w-full bg-gray-700 rounded-full h-2.5 mr-2">
                        <div
                            className="bg-purple-600 h-2.5 rounded-full"
                            style={{ width: `${(skill.rating) * 10}%` }}
                        ></div>
                    </div>
                  
                </div>
              )}
            </div>
          ))}
        </div>
        {isEditing && (
          <Button onClick={addSkill} className="mt-4">
            <Plus className="w-4 h-4 mr-2" />
            Add Skill
          </Button>
        )}
      </div>

      {/* Save Button */}
      {isEditing && (
        <div className="flex justify-end mt-6">
          <Button
            onClick={updateUserProfile}
            className="bg-purple-600 hover:bg-purple-700 text-white"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      )}
    </motion.div>
  )
}

export default ProfileForm

