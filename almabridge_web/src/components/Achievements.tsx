"use client";

import React, { useState } from "react";
import { Typewriter } from "react-simple-typewriter";

interface Achiever {
    name: string;
    session: string;
    achievement: string;
    achievementDescription: string;
    category: string;
    department: string;
    image: string;
}

const Achievements: React.FC = () => {
    const [filter, setFilter] = useState<string>("all");
    const [departmentFilter, setDepartmentFilter] = useState<string>("all");
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

    const achievers: Achiever[] = [
        {
            name: "Zoya Naveed",
            session: "2021-2025",
            achievement: "Won a coding competition",
            achievementDescription: "Zoya competed in a national coding competition and secured first place. His performance demonstrated exceptional problem-solving skills.",
            category: "current",
            department: "Computer Science",
            image: "/assets/zoya.webp",
        },
        {
            name: "Shahzaib Ijaz",
            session: "2020-2024",
            achievement: "Published a research paper",
            achievementDescription: "Shahzaib published a groundbreaking research paper on AI, which was later presented at an international conference.",
            category: "alumni",
            department: "Electrical Engineering",
            image: "/assets/shahzaib.webp",
        },
        {
            name: "John Doe",
            session: "2020-2024",
            achievement: "Won a coding competition",
            achievementDescription: "John competed in a national coding competition and secured first place. His performance demonstrated exceptional problem-solving skills.",
            category: "alumni",
            department: "Computer Science",
            image: "/assets/zoya.webp",
        },
        {
            name: "Muhammad Abdullah",
            session: "2021-2025",
            achievement: "Published a research paper",
            achievementDescription: "Abdullah published a groundbreaking research paper on AI, which was later presented at an international conference.",
            category: "current",
            department: "Electrical Engineering",
            image: "/assets/me.webp",
        },
        {
            name: "Fatima Awais",
            session: "2020-2024",
            achievement: "Won a coding competition",
            achievementDescription: "Fatima competed in a national coding competition and secured first place. His performance demonstrated exceptional problem-solving skills.",
            category: "alumni",
            department: "Computer Science",
            image: "/assets/fatima.webp",
        },
        {
            name: "Jane Smith",
            session: "2021-2025",
            achievement: "Published a research paper",
            achievementDescription: "Jane published a groundbreaking research paper on AI, which was later presented at an international conference.",
            category: "current",
            department: "Civil Engineering",
            image: "/assets/shahzaib.webp",
        },
        {
            name: "John Doe",
            session: "2020-2024",
            achievement: "Won a coding competition",
            achievementDescription: "John competed in a national coding competition and secured first place. His performance demonstrated exceptional problem-solving skills.",
            category: "alumni",
            department: "Mechanical Engineering",
            image: "/assets/zoya.webp",
        },
    ];

    const filteredAchievers = achievers.filter(
        (achiever) =>
            (filter === "all" || achiever.category === filter) &&
            (departmentFilter === "all" || achiever.department === departmentFilter)
    );

    return (
        <div className="flex flex-col min-h-screen">
            {/* Sidebar */}
            <div
                className={`transition-transform duration-500 ease-in-out ${
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                } fixed z-10 w-64 bg-black h-full shadow-lg sm:w-64 lg:w-64 xl:w-64 md:w-64`}
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
                        <label className="text-white block text-sm font-semibold mb-2">
                            Department
                        </label>
                        <select
                            onChange={(e) => setDepartmentFilter(e.target.value)}
                            className="w-full p-2 rounded bg-black text-white"
                        >
                            <option value="all">All Departments</option>
                            <option value="Computer Science">Computer Science</option>
                            <option value="Electrical Engineering">Electrical Engineering</option>
                            <option value="Mechanical Engineering">Mechanical Engineering</option>
                            <option value="Civil Engineering">Civil Engineering</option>
                        </select>
                    </div>

                    {/* Session Filter */}
                    <div className="mb-4">
                        <label className="text-white block text-sm font-semibold mb-2">Session</label>
                        <select
                            onChange={(e) => console.log("Session:", e.target.value)}
                            className="w-full p-2 rounded bg-black text-white"
                        >
                            <option value="all">All Sessions</option>
                            <option value="2020-2024">2020-2024</option>
                            <option value="2021-2025">2021-2025</option>
                            <option value="2019-2023">2019-2023</option>
                        </select>
                    </div>

                    {/* Achiever Type Filter */}
                    <div className="mb-6">
                        <label className="text-white block text-sm font-semibold mb-2">
                            Achievers
                        </label>
                        <div className="flex flex-col gap-2">
                            <label className="text-white flex items-center">
                                <input
                                    type="checkbox"
                                    checked={filter === "alumni" || filter === "all"}
                                    onChange={() => setFilter(filter === "alumni" ? "all" : "alumni")}
                                    className="mr-2"
                                />
                                Alumni
                            </label>
                            <label className="text-white flex items-center">
                                <input
                                    type="checkbox"
                                    checked={filter === "current" || filter === "all"}
                                    onChange={() => setFilter(filter === "current" ? "all" : "current")}
                                    className="mr-2"
                                />
                                Current Students
                            </label>
                            <label className="text-white flex items-center">
                                <input
                                    type="checkbox"
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
                        className="text-[#00BDD6] text-2xl absolute left-4 sm:left-4 lg:left-4 xl:left-4 md:left-4"
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
                        >
                            <div className="flex flex-col items-center justify-center text-center text-white">
                                <img
                                    src={achiever.image}
                                    alt={achiever.name}
                                    className="w-24 h-24 rounded-full mt-4"
                                />
                                <div className="mt-4">
                                    <h4 className="text-lg font-bold">{achiever.name}</h4>
                                    <p className="text-sm">Session: {achiever.session}</p>
                                    <p className="text-sm mt-2">{achiever.achievement}</p>
                                </div>
                            </div>
                            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-80 flex flex-col justify-center items-center text-white p-4 transition-opacity">
                                <p className="text-lg">{achiever.achievementDescription}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Achievements;
