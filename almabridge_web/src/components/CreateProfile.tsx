
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { FaPencilAlt, FaCamera, FaPlus, FaTrash } from "react-icons/fa";

export default function CreateProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: "Fatima",
    lastName: "Awais",
    address: "123 Main St, Springfield",
    aboutMe: "A passionate full-stack developer.",
    linkedin: "https://linkedin.com/in/fatima-awais",
    bio: "A passionate full-stack developer with experience in React and Node.js.",
    gender: "Female",
    primaryEmail: "hi",
    secondaryEmail: "hi2",
    education: ["B.Sc. in Computer Science from XYZ University"],
    workExperience: ["Software Developer at ABC Corp for 2 years"],
    skills: [
      { name: "React", rating: 4 },
      { name: "Node.js", rating: 5 },
      { name: "MongoDB", rating: 3 },
    ],
    resume: "resume.pdf",
  });

  const [profilePicture, setProfilePicture] = useState("/assets/fatima.webp");

  const toggleEdit = () => setIsEditing(!isEditing);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileData((prev) => ({ ...prev, resume: file.name }));
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

  const handleRatingChange = (skillName: string, newRating: number) => {
    setProfileData((prev) => ({
      ...prev,
      skills: prev.skills.map((skill) =>
        skill.name === skillName ? { ...skill, rating: newRating } : skill
      ),
    }));
  };  

  const addEducationField = () =>
    setProfileData((prev) => ({
      ...prev,
      education: [...prev.education, ""],
    }));

  const updateEducation = (index: number, value: string) => {
    const updatedEducation = [...profileData.education];
    updatedEducation[index] = value;
    setProfileData((prev) => ({ ...prev, education: updatedEducation }));
  };

  const removeEducation = (index: number) => {
    const updatedEducation = profileData.education.filter((_, i) => i !== index);
    setProfileData((prev) => ({ ...prev, education: updatedEducation }));
  };

  const addWorkExperienceField = () =>
    setProfileData((prev) => ({
      ...prev,
      workExperience: [...prev.workExperience, ""],
    }));

  const updateWorkExperience = (index: number, value: string) => {
    const updatedWorkExperience = [...profileData.workExperience];
    updatedWorkExperience[index] = value;
    setProfileData((prev) => ({ ...prev, workExperience: updatedWorkExperience }));
  };

  const removeWorkExperience = (index: number) => {
    const updatedWorkExperience = profileData.workExperience.filter((_, i) => i !== index);
    setProfileData((prev) => ({ ...prev, workExperience: updatedWorkExperience }));
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
              onChange={handleResumeUpload}
              className="w-full bg-gray-900 border border-gray-700 rounded-md px-4 py-2 text-gray-200 focus:ring-2 focus:ring-[#00BDD6]"
              
            />
          ) : (
            <div className="mb-5">
              <a
                href={`/assets/${profileData.resume}`}
                download
                className="text-[#00BDD6] hover:underline text-lg font-medium"
              >
                {profileData.resume || "Upload your resume"}
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
                onChange={(e) => setProfileData({ ...profileData, secondaryEmail: e.target.value })}
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
                onChange={(e) => setProfileData({ ...profileData, gender: e.target.value })}
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
            {profileData.workExperience.map((experience, index) => (
              <div key={index} className="flex items-center mb-2">
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      value={experience}
                      onChange={(e) => updateWorkExperience(index, e.target.value)}
                      className="w-full bg-gray-900 border border-gray-700 rounded-md px-4 py-2"
                      
                    />
                    <button onClick={() => removeWorkExperience(index)} className="ml-2 text-red-500">
                      <FaTrash />
                    </button>
                  </>
                ) : (
                  <p>
                    {experience}
                  </p>
                )}
              </div>
            ))}
            {isEditing && (
              <button onClick={addWorkExperienceField} className="text-[#00BDD6] mt-2 flex items-center">
                <FaPlus className="mr-1" /> Add Work Experience
              </button>
            )}
          </div>

          {/* Education */}
          <div>
            <h2 className="text-xl font-bold mb-2">Education</h2>
            {isEditing ? (
              profileData.education.map((edu, index) => (
                <div key={index} className="flex items-center mb-2">
                  <input
                    type="text"
                    value={edu}
                    onChange={(e) => updateEducation(index, e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 rounded-md px-4 py-2"
                    
                  />
                  <button onClick={() => removeEducation(index)} className="ml-2 text-red-500">
                    <FaTrash />
                  </button>
                </div>
              ))
            ) : (
              profileData.education.map((edu, index) => <p key={index}>{edu}</p>)
            )}
            {isEditing && (
              <button onClick={addEducationField} className="text-[#00BDD6] mt-2">
                <FaPlus /> Add Education
              </button>
            )}
          </div>
          {/* Skills */}
          <div>
            <h2 className="text-xl font-bold mb-2">Skills</h2>
            {profileData.skills.map((skill) => (
              <div key={skill.name} className="flex items-center mb-4">
                <span className="w-1/4 text-gray-300">{skill.name}</span>
                <div className="flex-1">
                  {isEditing ? (
                    <input
                      type="range"
                      min="0"
                      max="5"
                      step="1"
                      value={skill.rating}
                      onChange={(e) =>
                        handleRatingChange(skill.name, Number(e.target.value))
                      }
                      className="w-full bg-gray-700 h-2 rounded-full focus:ring-2 focus:ring-[#00BDD6]"
                      
                    />
                  ) : (
                    <div className="bg-gray-700 h-2 rounded-full">
                      <div
                        className="bg-[#00BDD6] h-full rounded-full"
                        style={{ width: `${(skill.rating / 5) * 100}%` }}
                      ></div>
                    </div>
                  )}
                </div>
              </div>
            ))}
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
