"use client"

import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import Image from "next/image";
import { UpdateProfile } from "@/lib/api/profileService";
import { ResumeParser } from "@/lib/api/resumeService";
import { GetUserInfo } from "@/lib/api/userService";
import { Certification, Education, ProfileData, ResumeData, WorkExperience } from "@/types";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { Label } from "../ui/Label";
import { Camera, PencilLine, Trash2, Plus } from "lucide-react"
import { Textarea } from "../ui/Textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../ui/Select";
import { gender } from "@/data";
import { toast } from "react-toastify"


const ProfileForm: React.FC = () => {

    const [token, setToken] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState<boolean>(false);
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

    const [profilePicture, setProfilePicture] = useState<string>("/assets/Default_pfp.jpg");
    const [profileObject, setProfileObject] = useState<File>();

    const router = useRouter();

    useEffect(() => {
        if (typeof window !== "undefined") {
          const storedToken = localStorage.getItem("token");
          setToken(storedToken);
        }
    }, []);

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const toggleEdit = () => setIsEditing(!isEditing);

    const fetchUser = useCallback(async () => {
      if (!token) return;

      try {
        const data = await GetUserInfo(token);
        setProfileData((prev) => ({
          ...prev,
          firstName: data.firstName,
          lastName: data.lastName,
          primaryEmail: data.email,
        }));
      } catch (error) {
        console.error("Failed to Load User Data", error);
        toast.error("Failed to Load User Data");
      }
    }, [token]);


    useEffect(() => {
      fetchUser();
    }, [fetchUser]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setProfileData((prev) => ({ ...prev, [name]: value }));
    }



    const updateUserProfile = async () => {
    if (!token) return;

    try {
      setIsLoading(true);
      const formData = new FormData();

      // Append text data
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
      ];
      textFields.forEach((field) => {
        const value = profileData[field];
        if (typeof value === "string") {
          formData.append(field, value);
        }
      });

      // Append education data
      profileData.education.forEach((edu, index) => {
        Object.entries(edu).forEach(([key, value]) => {
          formData.append(`education[${index}][${key}]`, value || "");
        });
      });

      // Append work experience data
      profileData.workExperience.forEach((exp, index) => {
        Object.entries(exp).forEach(([key, value]) => {
          formData.append(`experiences[${index}][${key}]`, value || "");
        });
      });

      // Append skills
      profileData.skills.forEach((skill, index) => {
        formData.append(`skills[${index}][skillName]`, skill.name);
        formData.append(`skills[${index}][rating]`, skill.rating.toString());
      });

      // Append certifications
      profileData.certification.forEach((cert, index) => {
        Object.entries(cert).forEach(([key, value]) => {
          formData.append(`certifications[${index}][${key}]`, value || "");
        });
      });

      // Append file if provided
      if (profileObject) {
        formData.append("file", profileObject);
      }

      const message = await UpdateProfile(formData, token);
      console.log(message);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating user profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
      setIsEditing(false);
      router.push("/dashboard");
    }
  };


    const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      try {
        const parsedData:ResumeData = await ResumeParser(file);

        setProfileData((prev) => {
          const updatedProfile: ProfileData = { ...prev };

          updatedProfile.address = parsedData.Address || prev.address;

          if (parsedData["Work Experience"]) {
            updatedProfile.workExperience = parsedData["Work Experience"].map((exp) => ({
              company: exp.Company,
              role: exp.Title,
              startDate: exp.Dates?.split("–")[0]?.trim() || "",
              endDate: exp.Dates?.split("–")[1]?.trim() || "Present",
              description: exp.Description,
            }));
          }

          if (parsedData.Skills) {
            updatedProfile.skills = [
              ...(parsedData.Skills.Languages?.map((lang) => ({ name: lang, rating: 5 })) || []),
              ...(parsedData.Skills.Frameworks?.map((fw) => ({ name: fw, rating: 5 })) || []),
              ...(parsedData.Skills.Libraries?.map((lib) => ({ name: lib, rating: 5 })) || []),
              ...(parsedData.Skills["Developer Tools"]?.map((tool) => ({ name: tool, rating: 5 })) || []),
            ];
          }

          if (parsedData.Education) {
            updatedProfile.education = [
              {
                school: parsedData.Education.University,
                degree: parsedData.Education.Degree,
                fieldOfStudy: "",
                graduationYear: parsedData.Education.Dates?.split("–")[1]?.trim() || "",
              },
            ];
          }

          if (parsedData.Certifications) {
            updatedProfile.certification = parsedData.Certifications.map((cert) => ({
              name: cert.name,
              issuer: cert.issuer || "",
              date: cert.date || "",
            }));
          }

          return updatedProfile;
        });
      } catch (error) {
        console.error("Error uploading resume:", error);
      }
    };


    const handlePictureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && file.size <= 5 * 1024 * 1024) {
        const imageUrl = URL.createObjectURL(file);
        setProfilePicture(imageUrl);
        setProfileObject(file);
      } else {
        alert("File size must be less than 5MB.");
      }
    };


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
      const updatedEducation = [...profileData.education] ;
      updatedEducation[index] = {
        ...updatedEducation[index],
        [field]: value,
      }
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

    const addCertificationField = () => {
      setProfileData({
        ...profileData,
        certification: [
          ...profileData.certification,
          { name: "", issuer: "", date: "" },
        ],
      });
    };


    const updateCertificationField = (
      index: number,
      field: keyof Certification,
      value: string
    ) => {
      const updatedCertification = [...profileData.certification];
      updatedCertification[index] = {
        ...updatedCertification[index],
        [field]: value,
      };
      setProfileData({ ...profileData, certification: updatedCertification });
    };
  
    const removeCertification = (index: number) => {
      const updatedCertification = profileData.certification.filter(
        (_, i) => i !== index
      );
      setProfileData((prev) => ({
        ...prev,
        certifications: updatedCertification,
      }));
    };

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
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-900 via-black to-black text-white">
            {/* Top Section */}
            <div className="bg-black h-60 animate-fadeIn"></div>
      
            {/* Profile Info */}
            <div className="flex-1 px-6 md:px-20 -mt-32 animate-slideIn">
              {/* Profile Picture & Header */}
              <div className="flex flex-col md:flex-row items-center mb-8">
                <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-transparent mb-4 md:mb-0 transition-all duration-300 ease-in-out hover:ring-4 hover:ring-[#00BDD6] hover:scale-105 relative">
                  {isEditing && (
                    <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
                      <Camera size={30} />
                    </div>
                  )}
                  {/* Only show file picker when isEditing is true */}
                  {isEditing && (
                    <Input 
                      type="file"
                      accept="image/*"
                      onChange={handlePictureUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      id="profile-picture-upload"
                      style={{zIndex: 1}}
                    />
                  )}
                  <label htmlFor="profile-picture-upload">
                    <Image
                      src={profilePicture}
                      alt="User Image"
                      width={160}
                      height={160}
                      className="object-cover cursor-pointer"
                    />
                  </label>
                </div>
                <div className="ml-0 md:ml-8 flex-1 text-center md:text-left">
                  <div className="flex justify-between items-center">
                    <h1 className="text-3xl md:text-4xl font-bold">
                      {profileData.firstName} {profileData.lastName}
                    </h1>
                    <Button
                      variant={"ghost"}
                      size={"icon"}
                      type="button"
                      onClick={toggleEdit}
                      className="ml-2 hover:text-[#00BDD6] hover:bg-transparent"
                    >
                      <PencilLine size={20} />
                    </Button>
                  </div>
                  <p className="text-gray-400 mt-2">Computer Scientist</p>
                </div>
              </div>
      
              {/* Resume Upload - Repositioned to the Top */}
              <div className="mb-6 mt-10">
                <h2 className="text-xl font-bold mb-2">Resume</h2>
                {isEditing ? (
                  <Input 
                    type="file"
                    accept=".pdf"
                    onChange={handleResumeUpload}
                  />
                ) : (
                  <div className="mb-5">
                    <a
                      //href={profileData.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#00BDD6] hover:underline"
                    >
                      View Resume
                    </a>
                  </div>
                )}
              </div>
      
              {/* Profile Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* First Name & Last Name */}
                <div>
                  <h2 className="text-xl font-bold mb-2">First Name</h2>
                  {isEditing ? (
                    <Input 
                      type="text"
                      name="firstName"
                      value={profileData.firstName}
                      onChange={handleChange}
                    />
                  ) : (
                    <p className="text-gray-300">{profileData.firstName}</p>
                  )}
                </div>
      
                <div>
                  <h2 className="text-xl font-bold mb-2">Last Name</h2>
                  {isEditing ? (
                    <Input 
                      type="text"
                      name="lastName"
                      value={profileData.lastName}
                      onChange={handleChange}
                    />
                  ) : (
                    <p className="text-gray-300">{profileData.lastName}</p>
                  )}
                </div>
      
                {/* Address */}
                <div>
                  <h2 className="text-xl font-bold mb-2">Address</h2>
                  {isEditing ? (
                    <Input 
                      type="text"
                      name="address"
                      value={profileData.address}
                      onChange={handleChange}
                    />
                  ) : (
                    <p className="text-gray-300">{profileData.address}</p>
                  )}
                </div>
      
                {/* LinkedIn */}
                <div>
                  <h2 className="text-xl font-bold mb-2">LinkedIn</h2>
                  {isEditing ? (
                    <Input 
                      type="text"
                      name="linkedin"
                      value={profileData.linkedin}
                      onChange={handleChange}
                    />
                  ) : (
                    <a
                      href={profileData.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#00BDD6] hover:underline"
                    >
                      {profileData.linkedin}
                    </a>
                  )}
                </div>
                {/* Linktree */}
                <div>
                  <h2 className="text-xl font-bold mb-2">Linktree</h2>
                  {isEditing ? (
                    <Input 
                      type="text"
                      name="lintree"
                      value={profileData.linktree}
                      onChange={handleChange}
                    />
                  ) : (
                    <a
                      href={profileData.linktree}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#00BDD6] hover:underline"
                    >
                      {profileData.linktree}
                    </a>
                  )}
                </div>
                {/* Portfolio */}
                <div>
                  <h2 className="text-xl font-bold mb-2">Portfolio</h2>
                  {isEditing ? (
                    <Input 
                      type="text"
                      name="portfolio"
                      value={profileData.portfolio}
                      onChange={handleChange}
                    />
                  ) : (
                    <a
                      href={profileData.portfolio}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#00BDD6] hover:underline"
                    >
                      {profileData.portfolio}
                    </a>
                  )}
                </div>
      
                {/* Primary Email */}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold">Primary Email</h3>
                  {isEditing ? (
                    <Input 
                      type="email"
                      value={profileData.primaryEmail}
                      disabled={true}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          primaryEmail: e.target.value,
                        })
                      }
                    />
                  ) : (
                    <p>{profileData.primaryEmail}</p>
                  )}
                </div>
      
                {/* Secondary Email */}
                <div>
                  <h3 className="text-lg font-semibold">Secondary Email</h3>
                  {isEditing ? (
                    <Input 
                      type="email"
                      value={profileData.secondaryEmail}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          secondaryEmail: e.target.value,
                        })
                      }
                      placeholder="Your Secondary Email here..."
                    />
                  ) : (
                    <p>{profileData.secondaryEmail}</p>
                  )}
                </div>
      
                {/* Gender */}
                <div>
                  <h2 className="text-xl font-bold mb-2">Gender</h2>
                  {isEditing ? (
                    <Select onValueChange={(value) => setProfileData({ ...profileData, gender: value })} value={profileData.gender}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Departments</SelectItem>
                        {gender.map((gen) => (
                          <SelectItem key={gen} value={gen}>
                            {gen}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <p>{profileData.gender}</p>
                  )}
                </div>
      
                {/* Bio */}
                <div>
                  <h2 className="text-xl font-bold mb-2">Bio</h2>
                  {isEditing ? (
                    <Textarea 
                      name="bio"
                      value={profileData.bio}
                      onChange={handleChange}
                    />
                  ) : (
                    <p className="text-gray-300">{profileData.bio}</p>
                  )}
                </div>
      
                {/* Work Experience */}
                <div>
                  <h2 className="text-xl font-bold mb-2">Work Experience</h2>
                  {isEditing
                    ? profileData.workExperience.map((experience, index) => (
                        <div key={index} className="mb-4 p-4 bg-gray-900 rounded-md">
                          <div className="mb-2">
                            <Label htmlFor="company">Company</Label>
                            <Input
                              type="date"
                              name="company"
                              value={experience.company}
                              onChange={(e) =>
                                updateWorkExperienceField(
                                  index,
                                  "company",
                                  e.target.value
                                )
                              }
                              placeholder="e.g., ABC Corp"
                            />
                          </div>
                          <div className="mb-2">
                            <Label htmlFor="role">Role</Label>
                            <Input
                              type="date"
                              name="role"
                              value={experience.endDate}
                              onChange={(e) =>
                                updateWorkExperienceField(
                                  index,
                                  "role",
                                  e.target.value
                                )
                              }
                              placeholder="e.g., Software Engineer"
                            />
                          </div>
                          <div className="flex gap-4 mb-2">
                            <div className="flex-1">
                              <Label htmlFor="startDate">Start Date</Label>
                              <Input
                                type="date"
                                name="startDate"
                                value={experience.endDate}
                                onChange={(e) =>
                                  updateWorkExperienceField(
                                    index,
                                    "startDate",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                            <div className="flex-1">
                              <Label htmlFor="endDate">End Date</Label>
                              <Input
                                type="date"
                                name="endDate"
                                value={experience.endDate}
                                onChange={(e) =>
                                  updateWorkExperienceField(
                                    index,
                                    "endDate",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                          </div>
                          <div className="mb-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea 
                              name="description" 
                              value={experience.description}
                              onChange={(e) =>
                                updateWorkExperienceField(
                                  index,
                                  "description",
                                  e.target.value
                                )
                              }
                              placeholder="e.g., Developed and maintained web applications..."
                            />
                          </div>
                          <Button
                              variant={"ghost"}
                              size={"icon"}
                              type="button"
                              onClick={() => removeWorkExperience(index)}
                              className="ml-2 text-red-500 hover:bg-transparent"
                          >
                            <Trash2 />
                          </Button>
                        </div>
                      ))
                    : profileData.workExperience.map((experience, index) => (
                        <div key={index} className="mb-4">
                          <p className="text-lg font-semibold">{experience.role}</p>
                          <p className="text-gray-300">
                            {experience.company} | {experience.startDate} -{" "}
                            {experience.endDate || "Present"}
                          </p>
                          <p className="text-gray-400">{experience.description}</p>
                        </div>
                      ))}
                  {isEditing && (
                    <Button
                      variant={"ghost"}
                      size={"icon"}
                      type="button"
                      onClick={addWorkExperienceField}
                      className="text-[#00BDD6] mt-2 flex items-center hover:bg-transparent"
                    >
                      <Plus className="mr-2" /> Add Work Experience
                    </Button>
                  )}
                </div>
      
                {/* Education */}
                <div>
                  <h2 className="text-xl font-bold mb-2">Education</h2>
                  {isEditing
                    ? profileData.education.map((edu, index) => (
                        <div key={index} className="mb-4 p-4 bg-gray-900 rounded-md">
                          <div className="mb-2">
                            <Label htmlFor="school">School</Label>
                            <Input 
                              type="text"
                              name="school"
                              value={edu.school}
                              onChange={(e) =>
                                updateEducationField(
                                  index,
                                  "school",
                                  e.target.value
                                )
                              }
                              placeholder="e.g., University or College Name"
                            />
                          </div>
                          <div className="mb-2">
                            <Label htmlFor="degree">Degree</Label>
                            <Input 
                              type="text"
                              name="degree"
                              value={edu.degree}
                              onChange={(e) =>
                                updateEducationField(
                                  index,
                                  "degree",
                                  e.target.value
                                )
                              }
                              placeholder="e.g., Bachelor's"
                            />
                          </div>
                          <div className="mb-2">
                            <Label htmlFor="fieldOfStudy">Field of Study</Label>
                            <Input 
                              type="text"
                              name="fieldOfStudy"
                              value={edu.fieldOfStudy}
                              onChange={(e) =>
                                updateEducationField(
                                  index,
                                  "fieldOfStudy",
                                  e.target.value
                                )
                              }
                              placeholder="e.g., Computer Science"
                            />
                          </div>
                          <div className="mb-2">
                            <Label htmlFor="graduationYear">Graduation Year</Label>
                            <Input 
                              type="text"
                              name="graduationYear"
                              value={edu.graduationYear}
                              onChange={(e) =>
                                updateEducationField(
                                  index,
                                  "graduationYear",
                                  e.target.value
                                )
                              }
                              placeholder="e.g., 2025"
                            />
                          </div>
                          <Button
                              variant={"ghost"}
                              size={"icon"}
                              type="button"
                              onClick={() => removeEducation(index)}
                              className="ml-2 text-red-500 hover:bg-transparent"
                          >
                            <Trash2 />
                          </Button>
                        </div>
                      ))
                    : profileData.education.map((edu, index) => (
                        <div key={index} className="mb-4">
                          <p className="text-lg font-semibold">{edu.school}</p>
                          <p className="text-gray-300">
                            {edu.degree} in {edu.fieldOfStudy}
                          </p>
                          <p className="text-gray-400">
                            Graduated: {edu.graduationYear}
                          </p>
                        </div>
                      ))}
                  {isEditing && (
                    <Button
                      variant={"ghost"}
                      size={"icon"}
                      type="button"
                      onClick={addEducationField}
                      className="text-[#00BDD6] mt-2 flex items-center hover:bg-transparent"
                    >
                      <Plus className="mr-2" /> Add Education
                    </Button>
                  )}
                </div>
                {/* Certifications */}
                <div>
                  <h2 className="text-xl font-bold mb-2">Certifications</h2>
                  {isEditing
                    ? profileData.certification.map((cert, index) => (
                        <div key={index} className="mb-4 p-4 bg-gray-900 rounded-md">
                          <div className="mb-2">
                            <Label htmlFor="name">Name</Label>
                            <Input 
                              type="text"
                              name="name"
                              value={cert.name}
                              onChange={(e) =>
                                updateCertificationField(
                                  index,
                                  "name",
                                  e.target.value
                                )
                              }
                              placeholder="e.g., AWS Certified Developer - Associate"
                            />
                          </div>
                          <div className="mb-2">
                            <Label htmlFor="issuer">Issuer</Label>
                            <Input 
                              type="text"
                              name="issuer"
                              value={cert.issuer}
                              onChange={(e) =>
                                updateCertificationField(
                                  index,
                                  "issuer",
                                  e.target.value
                                )
                              }
                              placeholder="e.g., Amazon Web Services"
                            />
                          </div>
                          <div className="mb-2">
                            <Label htmlFor="date">Date</Label>
                            <Input 
                              type="date"
                              name="date"
                              value={cert.date}
                              onChange={(e) =>
                                updateCertificationField(
                                  index,
                                  "date",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          <Button
                              variant={"ghost"}
                              size={"icon"}
                              type="button"
                              onClick={() => removeCertification(index)}
                              className="ml-2 text-red-500 hover:bg-transparent"
                          >
                            <Trash2 />
                          </Button>
                        </div>
                      ))
                    : profileData.certification.map((cert, index) => (
                        <div key={index} className="mb-4">
                          <p className="text-lg font-semibold">{cert.name}</p>
                          <p className="text-gray-300">{cert.issuer}</p>
                          <p className="text-gray-400">{cert.date}</p>
                        </div>
                      ))}
                  {isEditing && (
                    <Button
                      variant={"ghost"}
                      size={"icon"}
                      type="button"
                      onClick={addCertificationField}
                      className="text-[#00BDD6] mt-2 flex items-center hover:bg-transparent"
                    >
                      <Plus className="mr-2" /> Add Certification
                    </Button>
                  )}
                </div>
      
                {/* Skills */}
                <div>
                  <h2 className="text-xl font-bold mb-2">Skills</h2>
                  {profileData.skills.map((skill, index) => (
                    <div key={index} className="flex items-center mb-4">
                      {isEditing ? (
                        <>
                          <Input 
                            type="text"
                            value={skill.name}
                            onChange={(e) =>
                              handleSkillNameChange(index, e.target.value)
                            }
                            placeholder="Skill Name"
                            className="w-1/4 rounded-md px-2 py-1 mr-2"
                          />
                          <Input 
                            type="range" 
                            min={0} 
                            max={10} 
                            step={1} 
                            value={skill.rating} 
                            onChange={(e) =>
                              handleRatingChange(index, Number(e.target.value))
                            }
                            className="flex-1 bg-gray-700 h-2 rounded-full focus:ring-2 focus:ring-[#00BDD6]"
                          />
                          <Button
                              variant={"ghost"}
                              size={"icon"}
                              type="button"
                              onClick={() => removeSkill(index)}
                              className="ml-2 text-red-500 hover:bg-transparent"
                          >
                            <Trash2 />
                          </Button>
                        </>
                      ) : (
                        <>
                          <span className="w-1/4 text-gray-300">{skill.name}</span>
                          <div className="flex-1 bg-gray-700 h-2 rounded-full">
                            <div
                              className="bg-[#00BDD6] h-full rounded-full"
                              style={{ width: `${(skill.rating / 10) * 100}%` }}
                            ></div>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                  {isEditing && (
                    <Button
                        variant={"ghost"}
                        size={"icon"}
                        type="button"
                        onClick={addSkill}
                        className="text-[#00BDD6] mt-2 flex items-center hover:bg-transparent"
                    >
                      <Plus className="mr-2" /> Add Skill
                    </Button>
                  )}
                </div>
              </div>
            </div>
      
            {/* Save Button */}
            {isEditing && (
              <div className="text-center mt-8 mb-8">
                <Button
                  variant={"default"}
                  size={"lg"}
                  className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg animate-fade-in-delay-3"
                  type="button"
                  onClick={() => { updateUserProfile() }}
                >
                  { isLoading ? "Saving Changes..." : "Save Changes" }
                </Button>
              </div>
            )}
      </div>
    );
}

export default ProfileForm;