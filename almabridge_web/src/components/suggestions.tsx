"use client";

import React, { useState } from "react";
import { Typewriter } from "react-simple-typewriter";
import { FaPlus, FaInfinity } from 'react-icons/fa';

interface Suggestion {
  name: string;
  title: string;
  mutualConnections: number;
  image: string;
  session: string;
  department: string;
  status: "alumni" | "student";
}

const Suggestions: React.FC = () => {
  const [filter, setFilter] = useState<string>("all");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sessionFilter, setSessionFilter] = useState<string>("all");
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const suggestions: Suggestion[] = [
    {
      name: "Zoya Naveed",
      title: "AI Engineer",
      mutualConnections: 5,
      image: "/assets/zoya.webp",
      session: "2021-2025",
      department: "Computer Science",
      status: "student",
    },
    {
      name: "Shahzaib Ijaz",
      title: "Software Engineer",
      mutualConnections: 8,
      image: "/assets/shahzaib.webp",
      session: "2021-2025",
      department: "Computer Science",
      status: "student",
    },
    {
      name: "John Doe",
      title: "Mechanical Engineer",
      mutualConnections: 3,
      image: "/assets/zoya.webp",
      session: "2022-2026",
      department: "Mechanical Engineering",
      status: "student",
    },
    {
      name: "Muhammad Abdullah",
      title: "Electrical Engineer",
      mutualConnections: 6,
      image: "/assets/me.webp",
      session: "2019-2023",
      department: "Electrical Engineering",
      status: "alumni",
    },
    {
      name: "Fatima Awais",
      title: "Software Engineer",
      mutualConnections: 7,
      image: "/assets/fatima.webp",
      session: "2020-2024",
      department: "Computer Science",
      status: "alumni",
    },
    {
      name: "Jane Smith",
      title: "Civil Engineer",
      mutualConnections: 4,
      image: "/assets/shahzaib.webp",
      session: "2023-2027",
      department: "Civil Engineering",
      status: "student",
    },
    {
      name: "John Doe",
      title: "Mechanical Engineer",
      mutualConnections: 2,
      image: "/assets/zoya.webp",
      session: "2022-2026",
      department: "Mechanical Engineering",
      status: "student",
    },
  ];

  // Applying all filters
  const filteredSuggestions = suggestions.filter(
    (suggestion) =>
      (filter === "all" || suggestion.status === filter) &&
      (departmentFilter === "all" || suggestion.department === departmentFilter) &&
      (sessionFilter === "all" || suggestion.session === sessionFilter) &&
      (statusFilter === "all" || suggestion.status === statusFilter)
  );

  return (
    <div className="flex flex-col min-h-screen">
      {/* Sidebar */}
      <div
        className={`transition-transform duration-500 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} fixed z-10 w-64 bg-black h-full shadow-lg sm:w-64 lg:w-64 xl:w-64 md:w-64`}
      >
        <button className="absolute top-4 right-4 text-white text-2xl" onClick={() => setSidebarOpen(false)}>
          &times;
        </button>
        <div className="p-4">
          <h3 className="text-xl font-bold text-white mb-6">Filters</h3>

          {/* Department Filter */}
          <div className="mb-4">
            <label className="text-white block text-sm font-semibold mb-2">Department</label>
            <select onChange={(e) => setDepartmentFilter(e.target.value)} className="w-full p-2 rounded bg-black text-white">
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
            <select onChange={(e) => setSessionFilter(e.target.value)} className="w-full p-2 rounded bg-black text-white">
              <option value="all">All Sessions</option>
              <option value="2020-2024">2020-2024</option>
              <option value="2021-2025">2021-2025</option>
              <option value="2022-2026">2022-2026</option>
              <option value="2019-2023">2019-2023</option>
              <option value="2023-2027">2023-2027</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="mb-6">
            <label className="text-white block text-sm font-semibold mb-2">Status</label>
            <div className="flex flex-col gap-2">
              <label className="text-white flex items-center">
                <input type="checkbox" checked={filter === "alumni" || filter === "all"} onChange={() => setFilter(filter === "alumni" ? "all" : "alumni")} className="mr-2" />
                Alumni
              </label>
              <label className="text-white flex items-center">
                <input type="checkbox" checked={filter === "student" || filter === "all"} onChange={() => setFilter(filter === "student" ? "all" : "student")} className="mr-2" />
                Student
              </label>
              <label className="text-white flex items-center">
                <input type="checkbox" checked={filter === "all"} onChange={() => setFilter("all")} className="mr-2" />
                All
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className={`flex-grow transition-all ${sidebarOpen ? "pl-64" : "pl-0"} w-full`}>
        <nav className="w-full bg-black p-4 shadow-md flex items-center relative">
          <button className="text-[#00BDD6] text-2xl absolute left-4 sm:left-4 lg:left-4 xl:left-4 md:left-4" onClick={() => setSidebarOpen((prev) => !prev)}>
            &#9776;
          </button>
          <h1 className="text-[#00BDD6] text-2xl font-bold mx-auto">
            <Typewriter words={["People you may know"]} loop={1} cursor cursorStyle="_" typeSpeed={100} deleteSpeed={50} delaySpeed={2000} />
          </h1>
        </nav>
      </div>

      <div className={`flex-grow transition-all ${sidebarOpen ? "pl-64" : "pl-0"} max-w-7xl mx-auto`}>
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mx-auto max-w-full card-container">
          {filteredSuggestions.map((suggestion, index) => (
            <div
              key={index}
              className="relative shadow-lg rounded-lg border border-[#00BDD6] bg-black p-6 transition-all hover:scale-105"
              style={{ width: sidebarOpen ? "calc(120% - 3rem)" : "18rem" }} // Dynamically adjust the card width
            >
              <div className="flex flex-col items-center justify-center text-center text-white">
                <img src={suggestion.image} alt={suggestion.name} className="w-24 h-24 rounded-full mt-4" />
                <div className="mt-4">
                  <h4 className="text-lg font-bold">{suggestion.name}</h4>
                  <p className="text-sm">{suggestion.title}</p>
                  <div className="flex items-center text-sm mt-2">
                    <FaInfinity className="text-white mr-2" />
                    {suggestion.mutualConnections} mutual connections
                  </div>
                  <p className="text-sm mt-2">{suggestion.session}</p>
                  <p className="text-sm mt-2">{suggestion.department}</p>
                </div>
              </div>
              <button className="w-full mt-4 p-2 bg-[#00BDD6] text-white rounded-lg flex items-center justify-center">
                <FaPlus className="text-white mr-2" />
                Connect
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Suggestions;
