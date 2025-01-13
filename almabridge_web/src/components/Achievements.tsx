"use client";

import React, { useState } from "react";
import { Typewriter } from "react-simple-typewriter";
import "../styles/achievements.css";

interface Achiever {
    achieverName: string;
    session: string;
    achievementName: string;
    achievementDescription: string;
    achieverCategory: string;
    department: string;
    achieverPicture: string;
    link: string; // New field for the link
}

const Achievements: React.FC = () => {
    const [filter, setFilter] = useState<string>("all");
    const [departmentFilter, setDepartmentFilter] = useState<string>("all");
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

    const [achievers, setAchievers] = useState<Achiever[]>([
        {
            achieverName: "Zoya Naveed",
            session: "2021-2025",
            achievementName: "Won a coding competition",
            achievementDescription:
                "Zoya competed in a national coding competition and secured first place. Her performance demonstrated exceptional problem-solving skills.",
            achieverCategory: "current",
            department: "Computer Science",
            achieverPicture: "/assets/zoya.webp",
            link: "https://www.google.com", // Sample link
        },
        {
            achieverName: "Shahzaib Ijaz",
            session: "2020-2024",
            achievementName: "Published a research paper",
            achievementDescription:
                "Shahzaib published a groundbreaking research paper on AI, which was later presented at an international conference.",
            achieverCategory: "alumni",
            department: "Electrical Engineering",
            achieverPicture: "/assets/shahzaib.webp",
            link: "https://www.google.com", // Sample link
        },
    ]);

    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const [selectedAchievement, setSelectedAchievement] = useState<number | null>(null);
    const [viewModalOpen, setViewModalOpen] = useState<boolean>(false);
    const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
    const [editData, setEditData] = useState<Achiever | null>(null);
    const [newAchiever, setNewAchiever] = useState<Achiever>({
        achieverName: "",
        session: "",
        achievementName: "",
        achievementDescription: "",
        achieverCategory: "",
        department: "",
        achieverPicture: "",
        link: "", // Initialize the new field
    });

    const handleCardClick = (index: number) => {
        setSelectedAchievement(index);
        setViewModalOpen(true);
    };

    const handleCloseViewModal = () => {
        setViewModalOpen(false);
        setSelectedAchievement(null);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
        setNewAchiever({
            achieverName: "",
            session: "",
            achievementName: "",
            achievementDescription: "",
            achieverCategory: "",
            department: "",
            achieverPicture: "",
            link: "", // Reset the new field
        });
    };

    const handleSaveNewAchievement = () => {
        setAchievers((prevAchievers) => [...prevAchievers, newAchiever]);

        handleDialogClose();
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewAchiever((prev) => ({
            ...prev,
            [name]: value,
        }));
    };



    const handleEdit = (index: number) => {
        const achievement = achievers[index];
        setEditData(achievement); // Set current achievement for editing
        setSelectedAchievement(index); // Save index for updating
        setEditModalOpen(true); // Open edit modal
    };

    const handleSaveEdit = () => {
        if (selectedAchievement !== null && editData) {
            const updatedAchievers = [...achievers];
            updatedAchievers[selectedAchievement] = editData; // Update the achievement at the selected index
            setAchievers(updatedAchievers);
            setEditModalOpen(false); // Close edit modal
        }
    };

    const [editMode, setEditMode] = useState<boolean>(false);

    const handleEditInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        index: number
    ) => {
        const { name, value } = e.target;
        setAchievers((prevAchievers) =>
            prevAchievers.map((achiever, i) =>
                i === index ? { ...achiever, [name]: value } : achiever
            )
        );
    };

    const saveEdit = (index: number) => {
        setEditMode(false);
        alert("Achievement updated successfully!");
    };

    const handleDelete = (index: number) => {
        if (window.confirm("Are you sure you want to delete this achievement?")) {
            setAchievers((prevAchievers) =>
                prevAchievers.filter((_, i) => i !== index)
            );
            setViewModalOpen(false);
        }
    };


    const filteredAchievers = achievers.filter(
        (achiever) =>
            (filter === "all" || achiever.achieverCategory === filter) &&
            (departmentFilter === "all" || achiever.department === departmentFilter)
    );


    return (
        <div className="flex flex-col min-h-screen">
            {/* Sidebar */}
            <div
                className={`transition-transform duration-500 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    } fixed z-10 w-64 bg-black h-full shadow-lg`}
            >
                <button
                    className="absolute top-4 right-4 text-white text-2xl"
                    onClick={() => setSidebarOpen(false)}
                >
                    &times;
                </button>
                <div className="p-4">
                    <h3 className="text-xl font-bold text-white mb-6">Filters</h3>
                    {/* Department Filter */}
                    <div className="mb-4">
                        <label className="text-white block text-sm font-semibold mb-2">Department</label>
                        <select
                            onChange={(e) => setDepartmentFilter(e.target.value)}
                            value={departmentFilter}
                            className="w-full p-2 rounded bg-black text-white"
                        >
                            <option value="all">All Departments</option>
                            <option value="Computer Science">Computer Science</option>
                            <option value="Computer Engineering">Computer Engineering</option>
                            <option value="Civil Engineering">Civil Engineering</option>
                            <option value="Electrical Engineering">Electrical Engineering</option>
                        </select>
                    </div>

                    {/* Achiever Type Filter */}
                    <div className="mb-6">
                        <label className="text-white block text-sm font-semibold mb-2">Achievers</label>
                        <div className="flex flex-col gap-2">
                            <label className="text-white flex items-center">
                                <input
                                    type="radio"
                                    name="categoryFilter"
                                    checked={filter === "alumni"}
                                    onChange={() => setFilter("alumni")}
                                    className="mr-2"
                                />
                                Alumni
                            </label>
                            <label className="text-white flex items-center">
                                <input
                                    type="radio"
                                    name="categoryFilter"
                                    checked={filter === "current"}
                                    onChange={() => setFilter("current")}
                                    className="mr-2"
                                />
                                Current Students
                            </label>
                            <label className="text-white flex items-center">
                                <input
                                    type="radio"
                                    name="categoryFilter"
                                    checked={filter === "all"}
                                    onChange={() => setFilter("all")}
                                    className="mr-2"
                                />
                                All Achievers
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className={`flex-grow transition-all ${sidebarOpen ? "pl-64" : "pl-0"} w-full`}>
                <nav className="w-full bg-black p-4 shadow-md flex items-center relative">
                    <button
                        className="text-[#00BDD6] text-2xl absolute left-4"
                        onClick={() => setSidebarOpen((prev) => !prev)}
                    >
                        &#9776;
                    </button>
                    <h1 className="text-[#00BDD6] text-2xl font-bold mx-auto">
                        <Typewriter
                            words={["Hall of Fame"]}
                            loop={1}
                            cursor
                            cursorStyle="_"
                            typeSpeed={100}
                            deleteSpeed={50}
                            delaySpeed={1000}
                        />
                    </h1>
                </nav>
            </div>

            <div className={`flex-grow transition-all ${sidebarOpen ? "pl-64" : "pl-0"} max-w-7xl mx-auto`}>
                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mx-auto max-w-full card-container">
                    {filteredAchievers.map((achiever, index) => (
                        <div
                            key={index}
                            className="group relative shadow-lg rounded-lg border border-[#00BDD6] bg-gradient-to-r from-black to-black p-4 transition-all hover:bg-black"
                            onClick={() => handleCardClick(index)} // Card click handler
                        >
                            <div className="flex flex-col items-center justify-center text-center text-white">
                                <img
                                    src={achiever.achieverPicture}
                                    alt={achiever.achieverName}
                                    className="w-24 h-24 rounded-full mt-4"
                                />
                                <div className="mt-4">
                                    <h4 className="text-lg font-bold">{achiever.achieverName}</h4>
                                    <p className="text-sm">Session: {achiever.session}</p>
                                    <p className="text-sm">Department: {achiever.department}</p>
                                    <p className="text-sm mt-2">{achiever.achievementName}</p>
                                </div>
                                {/* Description shown on hover */}
                                <div className="absolute inset-0 bg-black bg-opacity-70 text-white p-4 opacity-0 group-hover:opacity-100 flex justify-center items-center transition-opacity">
                                    <p>{achiever.achievementDescription}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Floating Add Button */}
                <button
                    className="fixed bottom-10 right-10 bg-[#00BDD6] text-white p-6 rounded-full shadow-lg transform hover:scale-110 transition-all"
                    onClick={() => setDialogOpen(true)}
                >
                    +
                </button>

                {/* Achievement Full View Modal */}
                {viewModalOpen && selectedAchievement !== null && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-black p-8 rounded-lg w-full max-w-3xl text-white max-h-screen overflow-y-auto">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-2xl text-[#00BDD6] font-bold">Achievement Details</h3>

                                {/* Edit and Delete buttons on the right side */}
                                <div className="flex space-x-2">
                                    <button
                                        className="p-2 rounded text-[#00BDD6] hover:text-[#00BDD6]"
                                        onClick={() => setEditMode(true)} // Enable edit mode
                                    >
                                        <span className="text-[#00BDD6]">✏️</span> {/* Edit Icon */}
                                    </button>
                                    <button
                                        className="p-2 rounded text-red-500 hover:text-red-500"
                                        onClick={() => handleDelete(selectedAchievement)} // Call handleDelete
                                    >
                                        <span className="text-red-500">🗑️</span> {/* Delete Icon */}
                                    </button>
                                </div>
                            </div>

                            {editMode ? (
                                // Editable fields in edit mode
                                <div>
                                    <div className="mb-4">
                                        <label className="block text-[#00BDD6] mb-2">Name</label>
                                        <input
                                            className="w-full p-2 rounded bg-gray-800 text-white"
                                            name="name"
                                            value={achievers[selectedAchievement].achieverName}
                                            onChange={(e) => handleEditInputChange(e, selectedAchievement)}
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-[#00BDD6] mb-2">Session</label>
                                        <input
                                            className="w-full p-2 rounded bg-gray-800 text-white"
                                            name="session"
                                            value={achievers[selectedAchievement].session}
                                            onChange={(e) => handleEditInputChange(e, selectedAchievement)}
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-[#00BDD6] mb-2">Department</label>
                                        <select
                                            className="w-full p-2 rounded bg-gray-800 text-white"
                                            name="department"
                                            value={achievers[selectedAchievement].department}
                                            onChange={(e) => handleEditInputChange(e, selectedAchievement)}
                                        >
                                            <option value="Computer Science">Computer Science</option>
                                            <option value="Computer Engineering">Computer Engineering</option>
                                            <option value="Civil Engineering">Civil Engineering</option>
                                            <option value="Electrical Engineering">Electrical Engineering</option>
                                        </select>
                                    </div>


                                    <div className="mb-4">
                                        <label className="block text-[#00BDD6] mb-2">Category</label>
                                        <select
                                            className="w-full p-2 rounded bg-gray-800 text-white"
                                            name="category"
                                            value={achievers[selectedAchievement].achieverCategory}
                                            onChange={(e) => handleEditInputChange(e, selectedAchievement)}
                                        >
                                            <option value="Alumni">Alumni</option>
                                            <option value="Current">Current</option>
                                        </select>
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-[#00BDD6] mb-2">Achievement</label>
                                        <textarea
                                            className="w-full p-2 rounded bg-gray-800 text-white"
                                            name="achievement"
                                            value={achievers[selectedAchievement].achievementName}
                                            onChange={(e) => handleEditInputChange(e, selectedAchievement)}
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-[#00BDD6] mb-2">Achievement Description</label>
                                        <textarea
                                            className="w-full p-2 rounded bg-gray-800 text-white"
                                            name="description"
                                            value={achievers[selectedAchievement].achievementDescription}
                                            onChange={(e) => handleEditInputChange(e, selectedAchievement)}
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-[#00BDD6] mb-2">Link</label>
                                        <input
                                            className="w-full p-2 rounded bg-gray-800 text-white"
                                            name="link"
                                            value={achievers[selectedAchievement].link}
                                            onChange={(e) => handleEditInputChange(e, selectedAchievement)}
                                        />
                                    </div>
                                    <button
                                        className="bg-[#00BDD6] p-2 rounded text-white mr-2 mb-4"
                                        onClick={() => saveEdit(selectedAchievement)} // Save changes
                                    >
                                        Save
                                    </button>
                                    <span>
                                        <button
                                            className="bg-gray-600 p-2 rounded text-white"
                                            onClick={() => setEditMode(false)} // Cancel edit mode
                                        >
                                            Cancel
                                        </button>
                                    </span>

                                </div>
                            ) : (
                                // Read-only fields in view mode
                                <div>
                                    <div className="mb-4">
                                        <label className="block text-[#00BDD6] mb-2">Name</label>
                                        <p>{achievers[selectedAchievement].achieverName}</p>
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-[#00BDD6] mb-2">Session</label>
                                        <p>{achievers[selectedAchievement].session}</p>
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-[#00BDD6] mb-2">Department</label>
                                        <p>{achievers[selectedAchievement].department}</p>
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-[#00BDD6] mb-2">Category</label>
                                        <p>{achievers[selectedAchievement].achieverCategory}</p>
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-[#00BDD6] mb-2">Achievement</label>
                                        <p>{achievers[selectedAchievement].achievementName}</p>
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-[#00BDD6] mb-2">Achievement Description</label>
                                        <p>{achievers[selectedAchievement].achievementDescription}</p>
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-[#00BDD6] mb-2">Link</label>
                                        <p>{achievers[selectedAchievement].link}</p>
                                    </div>

                                </div>
                            )}

                            {/* Close Button */}
                            <button
                                className="bg-[#00BDD6] p-2 rounded text-white"
                                onClick={handleCloseViewModal}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}


                {/* Add New Achievement Modal */}
                {dialogOpen && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-black p-6 rounded-lg w-full max-w-4xl max-h-[80vh] overflow-auto text-white">
                            <h3 className="text-2xl text-[#00BDD6] mb-4 font-bold">Add New Achievement</h3>

                            <div>
                                {/* Name Field */}
                                <div className="mb-4">
                                    <label className="block text-[#00BDD6] mb-2">Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={newAchiever.achieverName}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full p-2 rounded bg-black text-white"
                                    />
                                </div>

                                {/* Session Field */}
                                <div className="mb-4">
                                    <label className="block text-[#00BDD6] mb-2">Session</label>
                                    <input
                                        type="text"
                                        name="session"
                                        value={newAchiever.session}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full p-2 rounded bg-black text-white"
                                    />
                                </div>

                                {/* Department Field with Custom Box Options */}
                                <div className="mb-4">
                                    <label className="block text-[#00BDD6] mb-2">Department</label>
                                    <select
                                        name="department"
                                        value={newAchiever.department}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full p-2 rounded bg-black text-white"
                                    >
                                        <option value="Computer Science">Computer Science</option>
                                        <option value="Computer Engineering">Computer Engineering</option>
                                        <option value="Civil Engineering">Civil Engineering</option>
                                        <option value="Electrical Engineering">Electrical Engineering</option>
                                    </select>
                                </div>

                                {/* Category Field */}
                                <div className="mb-4">
                                    <label className="block text-[#00BDD6] mb-2">Category</label>
                                    <select
                                        name="category"
                                        value={newAchiever.achieverCategory}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full p-2 rounded bg-black text-white"
                                    >
                                        <option value="current">Current</option>
                                        <option value="alumni">Alumni</option>
                                    </select>
                                </div>

                                {/* Achievement Field */}
                                <div className="mb-4">
                                    <label className="block text-[#00BDD6] mb-2">Achievement</label>
                                    <input
                                        type="text"
                                        name="achievement"
                                        value={newAchiever.achievementName}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full p-2 rounded bg-black text-white"
                                    />
                                </div>

                                {/* Achievement Description Field */}
                                <div className="mb-4">
                                    <label className="block text-[#00BDD6] mb-2">Achievement Description</label>
                                    <textarea
                                        name="achievementDescription"
                                        value={newAchiever.achievementDescription}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full p-2 rounded bg-black text-white"
                                    />
                                </div>

                                {/* Link Field */}
                                <div className="mb-4">
                                    <label className="block text-[#00BDD6] mb-2">Link</label>
                                    <input
                                        type="text"
                                        name="link"
                                        value={newAchiever.link}
                                        onChange={handleInputChange}
                                        className="w-full p-2 rounded bg-black text-white"
                                    />
                                </div>


                                {/* Image Upload Field */}
                                <div className="mb-4">
                                    <label className="block text-[#00BDD6] mb-2">Image</label>
                                    <input
                                        type="file"
                                        name="image"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                const reader = new FileReader();
                                                reader.onloadend = () => {
                                                    setNewAchiever((prev) => ({
                                                        ...prev,
                                                        image: reader.result as string,
                                                    }));
                                                };
                                                reader.readAsDataURL(file);
                                            }
                                        }}
                                        required
                                        className="w-full p-2 rounded bg-black text-white"
                                    />
                                </div>
                            </div>

                            {/* Save and Cancel Buttons */}
                            <div className="flex justify-between mt-6">
                                <button
                                    className="bg-gray-500 text-white px-6 py-2 rounded-lg"
                                    onClick={handleDialogClose}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="bg-[#00BDD6] text-white px-6 py-2 rounded-lg"
                                    onClick={handleSaveNewAchievement}
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Achievements;