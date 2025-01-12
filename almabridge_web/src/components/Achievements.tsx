"use client";

import React, { useState, useEffect } from "react";
import { Typewriter } from "react-simple-typewriter";
import "../styles/achievements.css";
import axios from "axios";

interface Achiever {
  achievementName: string;
  achieverName: string;
  achieverCategory: string;
  achievementsDescription: string;
  session: string;
  department: string;
  achieverPicture: string;
}

const Achievements: React.FC = () => {
  const [filter, setFilter] = useState<string>("all");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [achievers, setAchievers] = useState<Achiever[]>([]);

  useEffect(() => {
    // Fetch data from the backend API
    const fetchAchievers = async () => {
      try {
        const response = await axios.get<Achiever[]>(
          "http://127.0.0.1:3001/api/achievements/get"
        );
        setAchievers(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching achievers data:", error);
      }
    };

    fetchAchievers();
  }, []);

  const filteredAchievers = achievers.filter(
    (achiever) =>
      (filter === "all" || achiever.achieverCategory === filter) &&
      (departmentFilter === "all" || achiever.department === departmentFilter)
  );

  return (
    <div className="flex flex-col min-h-screen">
      {/* Sidebar */}
      <div
        className={`transition-transform duration-500 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
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
            <label className="text-white block text-sm font-semibold mb-2">
              Department
            </label>
            <select
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="w-full p-2 rounded bg-black text-white"
            >
              <option value="all">All Departments</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Electrical Engineering">
                Electrical Engineering
              </option>
              <option value="Mechanical Engineering">
                Mechanical Engineering
              </option>
              <option value="Civil Engineering">Civil Engineering</option>
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
                  onChange={() =>
                    setFilter(filter === "alumni" ? "all" : "alumni")
                  }
                  className="mr-2"
                />
                Alumni
              </label>
              <label className="text-white flex items-center">
                <input
                  type="checkbox"
                  checked={filter === "current" || filter === "all"}
                  onChange={() =>
                    setFilter(filter === "current" ? "all" : "current")
                  }
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
      <div
        className={`flex-grow transition-all ${
          sidebarOpen ? "pl-64" : "pl-0"
        } w-full`}
      >
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

      <div
        className={`flex-grow transition-all ${
          sidebarOpen ? "pl-64" : "pl-0"
        } max-w-7xl mx-auto`}
      >
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mx-auto max-w-full card-container">
          {filteredAchievers.map((achiever, index) => (
            <div
              key={index}
              className="group relative shadow-lg rounded-lg border border-[#00BDD6] bg-gradient-to-r from-black to-black p-4 transition-all hover:bg-black"
            >
              <div className="flex flex-col items-center justify-center text-center text-white">
                <img
                  src={`http://localhost:3001/${achiever.achieverPicture}`}
                  alt={achiever.achieverName}
                  className="w-24 h-24 rounded-full mt-4"
                />

                <div className="mt-4">
                  <h4 className="text-lg font-bold">{achiever.achieverName}</h4>
                  <p className="text-sm">Session: {achiever.session}</p>
                  <p className="text-sm mt-2">{achiever.achievementName}</p>
                </div>
              </div>
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-80 flex flex-col justify-center items-center text-white p-4 transition-opacity">
                <p className="text-lg">{achiever.achievementsDescription}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Achievements;
