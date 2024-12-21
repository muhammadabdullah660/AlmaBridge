"use client";

import React, { useState } from "react";
import Image from "next/image";
import { FaPencilAlt, FaCamera, FaPlus, FaTrash } from "react-icons/fa";
import { Education } from "../types";
import { WorkExperience } from "../types";
import axios from "axios";
export default function CreateProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    // dummy data
    firstName: "Jane",
    lastName: "Doe",
    address: "456 Elm Street, Metropolis, USA",
    aboutMe:
      "A dedicated full-stack developer enthusiastic about building impactful and scalable software solutions.",
    linkedin: "https://linkedin.com/in/jane-doe",
    bio: "Creative problem-solver with a strong background in web technologies and a passion for delivering high-quality user experiences.",
    gender: "Female",
    primaryEmail: "janedoe@example.com",
    secondaryEmail: "contact@janedoe.dev",
    education: [
      {
        school: "Metropolis University",
        degree: "Master of Science",
        fieldOfStudy: "Software Engineering",
        graduationYear: "2023",
      },
      {
        school: "Central Tech Institute",
        degree: "Bachelor of Technology",
        fieldOfStudy: "Information Technology",
        graduationYear: "2020",
      },
    ],
    workExperience: [
      {
        company: "Tech Giants Inc.",
        role: "Full-Stack Developer",
        startDate: "2023-03-01",
        endDate: "Present",
        description:
          "Developing enterprise-level applications, improving performance, and collaborating with cross-functional teams to deliver seamless solutions.",
      },
      {
        company: "Startup Solutions",
        role: "Junior Developer",
        startDate: "2021-01-15",
        endDate: "2023-02-28",
        description:
          "Built user-friendly interfaces and worked on integrating RESTful APIs. Collaborated with the team to successfully deploy multiple client projects.",
      },
    ],
    skills: [
      { name: "React", rating: 8 },
      { name: "Node.js", rating: 7 },
      { name: "MongoDB", rating: 6 },
      { name: "Python", rating: 9 },
      { name: "Docker", rating: 5 },
    ],
    certifications: [
      {
        name: "AWS Certified Developer - Associate",
        issuer: "Amazon Web Services",
        date: "2024-01-15",
      },
      {
        name: "Certified Kubernetes Administrator",
        issuer: "CNCF",
        date: "2023-07-10",
      },
    ],
    resume: "",
    portfolio: "https://janedoe.dev",
    linktree: "",
  });

  const [profilePicture, setProfilePicture] = useState("/assets/fatima.webp");

  const toggleEdit = () => setIsEditing(!isEditing);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      axios
        .post("http://127.0.0.1:5000/api/resumeExtract", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          const parsedData = res.data.resume_data;

          console.log("Parsed Data:", parsedData);
          // type of parsedData

          // Map JSON response to profileData
          setProfileData((prev) => {
            const updatedProfile = { ...prev };

            // Update simple fields
            if (parsedData.Name) {
              const [firstName, ...lastNameParts] = parsedData.Name.split(" ");
              updatedProfile.firstName = firstName || prev.firstName;
              updatedProfile.lastName =
                lastNameParts.join(" ") || prev.lastName;
            }
            updatedProfile.primaryEmail = parsedData.Email || prev.primaryEmail;
            updatedProfile.address = parsedData.Address || prev.address;

            // Map Work Experience
            if (parsedData["Work Experience"]) {
              updatedProfile.workExperience = parsedData["Work Experience"].map(
                (exp: {
                  Company: string;
                  Title: string;
                  Dates: string;
                  Description: string;
                }) => ({
                  company: exp.Company,
                  role: exp.Title,
                  startDate: exp.Dates.split("–")[0]?.trim(),
                  endDate: exp.Dates.split("–")[1]?.trim(),
                  description: exp.Description,
                })
              );
            }

            // Map Skills
            if (parsedData.Skills) {
              const combinedSkills = [
                ...parsedData.Skills.Languages.map((lang: string) => ({
                  name: lang,
                  rating: 5, // default rating
                })),
                ...parsedData.Skills.Frameworks.map((fw: string) => ({
                  name: fw,
                  rating: 5,
                })),
                ...parsedData.Skills.Libraries.map((lib: string) => ({
                  name: lib,
                  rating: 5,
                })),
                ...parsedData.Skills["Developer Tools"]?.map(
                  (tool: string) => ({
                    name: tool,
                    rating: 5,
                  })
                ),
              ];
              updatedProfile.skills = combinedSkills;
            }

            // Map Education
            if (parsedData.Education) {
              updatedProfile.education = [
                {
                  school: parsedData.Education.University,
                  degree: parsedData.Education.Degree,
                  fieldOfStudy: "Computer Science", // Set manually or parse if present
                  graduationYear: parsedData.Education["Graduation Year"] || "", // Add if available in response
                },
              ];
            }

            // Map Certifications
            if (parsedData.Certifications) {
              updatedProfile.certifications = parsedData.Certifications.map(
                (cert: string) => ({
                  name: cert,
                  issuer: "", // Add if available in response
                  date: "", // Add if available in response
                })
              );
            }

            // Map Projects
            // if (parsedData.Projects) {
            //   updatedProfile.projects = parsedData.Projects.map(
            //     (proj: {
            //       Name: string;
            //       Description: string;
            //       Technologies: string[];
            //       Dates: string;
            //     }) => ({
            //       name: proj.Name,
            //       description: proj.Description,
            //       technologies: proj.Technologies,
            //       dates: proj.Dates,
            //     })
            //   );
            // }

            return updatedProfile;
          });
        })
        .catch((err) => {
          console.error("Error processing resume:", err);
        });
    }
  };

  const handlePictureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.size <= 5 * 1024 * 1024) {
      const imageUrl = URL.createObjectURL(file);
      setProfilePicture(imageUrl);
    } else {
      alert("File size must be less than 5MB.");
    }
  };

  // Education
  const addEducationField = () => {
    setProfileData({
      ...profileData,
      education: [
        ...profileData.education,
        { school: "", degree: "", fieldOfStudy: "", graduationYear: "" },
      ],
    });
  };

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

  // Work Experience
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

  // Skills
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
                <FaCamera size={30} />
              </div>
            )}
            {/* Only show file picker when isEditing is true */}
            {isEditing && (
              <input
                type="file"
                accept="image/*"
                onChange={handlePictureUpload}
                className="absolute inset-0 opacity-0 cursor-pointer"
                id="profile-picture-upload"
                style={{ zIndex: 1 }}
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
              <button
                onClick={toggleEdit}
                className="text-gray-400 hover:text-[#00BDD6] transition duration-200 ml-4 md:ml-0"
              >
                <FaPencilAlt size={20} />
              </button>
            </div>
            <p className="text-gray-400 mt-2">Computer Scientist</p>
          </div>
        </div>

        {/* Resume Upload - Repositioned to the Top */}
        <div className="mb-6 mt-10">
          <h2 className="text-xl font-bold mb-2">Resume</h2>
          {isEditing ? (
            <input
              type="file"
              accept=".pdf"
              onChange={handleResumeUpload}
              className="w-full bg-gray-900 border border-gray-700 rounded-md px-4 py-2 text-gray-200 focus:ring-2 focus:ring-[#00BDD6]"
            />
          ) : (
            <div className="mb-5">
              <a
                href={profileData.resume}
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
              <input
                type="text"
                name="firstName"
                value={profileData.firstName}
                onChange={handleChange}
                className="w-full bg-gray-900 border border-gray-700 rounded-md px-4 py-2 text-gray-200 focus:ring-2 focus:ring-[#00BDD6]"
              />
            ) : (
              <p className="text-gray-300">{profileData.firstName}</p>
            )}
          </div>

          <div>
            <h2 className="text-xl font-bold mb-2">Last Name</h2>
            {isEditing ? (
              <input
                type="text"
                name="lastName"
                value={profileData.lastName}
                onChange={handleChange}
                className="w-full bg-gray-900 border border-gray-700 rounded-md px-4 py-2 text-gray-200 focus:ring-2 focus:ring-[#00BDD6]"
              />
            ) : (
              <p className="text-gray-300">{profileData.lastName}</p>
            )}
          </div>

          {/* Address */}
          <div>
            <h2 className="text-xl font-bold mb-2">Address</h2>
            {isEditing ? (
              <input
                type="text"
                name="address"
                value={profileData.address}
                onChange={handleChange}
                className="w-full bg-gray-900 border border-gray-700 rounded-md px-4 py-2 text-gray-200 focus:ring-2 focus:ring-[#00BDD6]"
              />
            ) : (
              <p className="text-gray-300">{profileData.address}</p>
            )}
          </div>

          {/* LinkedIn */}
          <div>
            <h2 className="text-xl font-bold mb-2">LinkedIn</h2>
            {isEditing ? (
              <input
                type="text"
                name="linkedin"
                value={profileData.linkedin}
                onChange={handleChange}
                className="w-full bg-gray-900 border border-gray-700 rounded-md px-4 py-2 text-gray-200 focus:ring-2 focus:ring-[#00BDD6]"
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
              <input
                type="text"
                name="linktree"
                value={profileData.linktree}
                onChange={handleChange}
                className="w-full bg-gray-900 border border-gray-700 rounded-md px-4 py-2 text-gray-200 focus:ring-2 focus:ring-[#00BDD6]"
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
              <input
                type="text"
                name="portfolio"
                value={profileData.portfolio}
                onChange={handleChange}
                className="w-full bg-gray-900 border border-gray-700 rounded-md px-4 py-2 text-gray-200 focus:ring-2 focus:ring-[#00BDD6]"
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
              <input
                type="email"
                value={profileData.primaryEmail}
                disabled={true}
                className="w-full bg-gray-700 text-gray-400 border border-gray-700 rounded-md px-4 py-2 cursor-not-allowed"
              />
            ) : (
              <p>{profileData.primaryEmail}</p>
            )}
          </div>

          {/* Secondary Email */}
          <div>
            <h3 className="text-lg font-semibold">Secondary Email</h3>
            {isEditing ? (
              <input
                type="email"
                value={profileData.secondaryEmail}
                onChange={(e) =>
                  setProfileData({
                    ...profileData,
                    secondaryEmail: e.target.value,
                  })
                }
                className="w-full bg-gray-900 border border-gray-700 rounded-md px-4 py-2"
              />
            ) : (
              <p>{profileData.secondaryEmail}</p>
            )}
          </div>

          {/* Gender */}
          <div>
            <h2 className="text-xl font-bold mb-2">Gender</h2>
            {isEditing ? (
              <select
                value={profileData.gender}
                onChange={(e) =>
                  setProfileData({ ...profileData, gender: e.target.value })
                }
                className="w-full bg-gray-900 border border-gray-700 rounded-md px-4 py-2"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            ) : (
              <p>{profileData.gender}</p>
            )}
          </div>

          {/* Bio */}
          <div>
            <h2 className="text-xl font-bold mb-2">Bio</h2>
            {isEditing ? (
              <textarea
                name="bio"
                value={profileData.bio}
                onChange={handleChange}
                className="w-full bg-gray-900 border border-gray-700 rounded-md px-4 py-2 text-gray-200 focus:ring-2 focus:ring-[#00BDD6]"
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
                      <label className="block text-gray-400 mb-1">
                        Company
                      </label>
                      <input
                        type="text"
                        name="company"
                        value={experience.company}
                        onChange={(e) =>
                          updateWorkExperienceField(
                            index,
                            "company",
                            e.target.value
                          )
                        }
                        className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2"
                        placeholder="e.g., ABC Corp"
                      />
                    </div>
                    <div className="mb-2">
                      <label className="block text-gray-400 mb-1">Role</label>
                      <input
                        type="text"
                        name="role"
                        value={experience.role}
                        onChange={(e) =>
                          updateWorkExperienceField(
                            index,
                            "role",
                            e.target.value
                          )
                        }
                        className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2"
                        placeholder="e.g., Software Engineer"
                      />
                    </div>
                    <div className="flex gap-4 mb-2">
                      <div className="flex-1">
                        <label className="block text-gray-400 mb-1">
                          Start Date
                        </label>
                        <input
                          type="date"
                          name="startDate"
                          value={experience.startDate}
                          onChange={(e) =>
                            updateWorkExperienceField(
                              index,
                              "startDate",
                              e.target.value
                            )
                          }
                          className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-gray-400 mb-1">
                          End Date
                        </label>
                        <input
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
                          className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2"
                        />
                      </div>
                    </div>
                    <div className="mb-2">
                      <label className="block text-gray-400 mb-1">
                        Description
                      </label>
                      <textarea
                        name="description"
                        value={experience.description}
                        onChange={(e) =>
                          updateWorkExperienceField(
                            index,
                            "description",
                            e.target.value
                          )
                        }
                        className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2"
                        placeholder="e.g., Developed and maintained web applications..."
                      />
                    </div>
                    <button
                      onClick={() => removeWorkExperience(index)}
                      className="text-red-500 mt-2"
                    >
                      <FaTrash /> Remove
                    </button>
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
              <button
                onClick={addWorkExperienceField}
                className="text-[#00BDD6] mt-2 flex items-center"
              >
                <FaPlus className="mr-2" /> Add Work Experience
              </button>
            )}
          </div>

          {/* Education */}
          <div>
            <h2 className="text-xl font-bold mb-2">Education</h2>
            {isEditing
              ? profileData.education.map((edu, index) => (
                  <div key={index} className="mb-4 p-4 bg-gray-900 rounded-md">
                    <div className="mb-2">
                      <label className="block text-gray-400 mb-1">School</label>
                      <input
                        type="text"
                        name="school"
                        value={edu.school}
                        onChange={(e) =>
                          updateEducationField(index, "school", e.target.value)
                        }
                        className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2"
                        placeholder="e.g., University of XYZ"
                      />
                    </div>
                    <div className="mb-2">
                      <label className="block text-gray-400 mb-1">Degree</label>
                      <input
                        type="text"
                        name="degree"
                        value={edu.degree}
                        onChange={(e) =>
                          updateEducationField(index, "degree", e.target.value)
                        }
                        className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2"
                        placeholder="e.g., Bachelor's"
                      />
                    </div>
                    <div className="mb-2">
                      <label className="block text-gray-400 mb-1">
                        Field of Study
                      </label>
                      <input
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
                        className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2"
                        placeholder="e.g., Computer Science"
                      />
                    </div>
                    <div className="mb-2">
                      <label className="block text-gray-400 mb-1">
                        Graduation Year
                      </label>
                      <input
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
                        className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2"
                        placeholder="e.g., 2025"
                      />
                    </div>
                    <button
                      onClick={() => removeEducation(index)}
                      className="text-red-500 mt-2"
                    >
                      <FaTrash /> Remove
                    </button>
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
              <button
                onClick={addEducationField}
                className="text-[#00BDD6] mt-2 flex items-center"
              >
                <FaPlus className="mr-2" /> Add Education
              </button>
            )}
          </div>
          {/* Skills */}
          {/* Skills */}
          <div>
            <h2 className="text-xl font-bold mb-2">Skills</h2>
            {profileData.skills.map((skill, index) => (
              <div key={index} className="flex items-center mb-4">
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      value={skill.name}
                      onChange={(e) =>
                        handleSkillNameChange(index, e.target.value)
                      }
                      placeholder="Skill Name"
                      className="w-1/4 bg-gray-900 border border-gray-700 rounded-md px-2 py-1 mr-2 text-gray-300"
                    />
                    <input
                      type="range"
                      min="0"
                      max="10"
                      step="1"
                      value={skill.rating}
                      onChange={(e) =>
                        handleRatingChange(index, Number(e.target.value))
                      }
                      className="flex-1 bg-gray-700 h-2 rounded-full focus:ring-2 focus:ring-[#00BDD6]"
                    />
                    <button
                      onClick={() => removeSkill(index)}
                      className="ml-2 text-red-500"
                    >
                      <FaTrash />
                    </button>
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
              <button
                onClick={addSkill}
                className="text-[#00BDD6] mt-2 flex items-center"
              >
                <FaPlus className="mr-2" /> Add Skill
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Save Button */}
      {isEditing && (
        <div className="text-center mt-8 mb-8">
          <button
            type="submit"
            onClick={toggleEdit}
            className="bg-[#00BDD6] text-gray-900 font-semibold px-6 py-2 rounded hover:bg-[#00a5c2] focus:outline-none focus:ring-2 focus:ring-[#00BDD6]"
          >
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
}
