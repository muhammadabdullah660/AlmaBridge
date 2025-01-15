"use client";
import React, { useState, useEffect } from "react";
import { Typewriter } from "react-simple-typewriter";
import "../styles/achievements.css";
import "../styles/userDashboard.css";
import { events } from "@/data";
import { discussions } from "@/data";


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

interface Jobs {
    jobName: string;
    jobDescription:string;
    salaryRange: string;
    location: [string, string, string]; // [city, state, country]
    postedById: string;
    jobType: string;
}

const UserDashboard: React.FC = () => {
    const [achievers, setAchievers] = useState<Achiever[]>([]);
    const [jobs, setJobs] = useState<Jobs[]>([]);

    useEffect(() => {
        // Fetch data from the backend API
        const fetchJobs = async () => {
            try {
                const response = await axios.get<Jobs[]>(
                    "http://127.0.0.1:3001/api/jobposting/get"
                );
                setJobs(response.data);
                console.log(response.data);
            } catch (error) {
                console.error("Error fetching achievers data:", error);
            }
        };

        fetchJobs();
    }, []);

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




    return (
        <div>
            {/*Top Achievements Section*/}
            <section>
                <div className="bg-[#191919]">
                    <div className="flex justify-center items-center min-h-screen  px-4">
                        <div className="text-center w-full max-w-5xl">
                            <h1 className="text-[#00BDD6] text-2xl font-bold mx-auto mb-6">
                                <Typewriter
                                    words={["Top Achievements"]}
                                    loop={1}
                                    cursor
                                    cursorStyle="_"
                                    typeSpeed={100}
                                    deleteSpeed={50}
                                    delaySpeed={1000}
                                />
                            </h1>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mx-auto card-container">
                                {achievers.slice(0, 3).map((achiever, index) => (
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
                    <div className="flex justify-center mt-8">
                        <button className="bg-[#00BDD6] text-black px-6 py-2 rounded-lg font-semibold hover:bg-[#009BB2] mb-4">
                            See more
                        </button>
                    </div>
                </div>
            </section>


            {/* AlmaBridge Section */}
            <section id="features" className="bg-black text-white py-24">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-[#00bdd6] alma-heading">
                        AlmaBridge
                    </h2>
                </div>

                <div className="flex flex-wrap justify-center">
                    <div className="w-[300px] h-[280px] bg-[#191919] text-white text-center p-5 m-5 rounded-lg shadow-md">
                        <div className="image-container mb-4">
                            <img
                                src="/assets/Container 3 (1).png"
                                alt="comment"
                                width={90}
                                height={90}
                            />
                        </div>
                        <h3 className="text-lg mb-2 text-[#737b8a] font-semibold">
                            Chat with an Alumni
                        </h3>
                        <p className="mb-5 text-sm font-medium">
                            Commodo qui nulla ipsum ea cupidatat sit aliquip
                        </p>
                        <a href="#" className="block text-[#00BDD6] p-2.5 rounded-md">
                            Explore →
                        </a>
                    </div>
                    <div className="w-[300px] h-[280px] bg-[#191919] text-white text-center p-5 m-5 rounded-lg shadow-md">
                        <div className="image-container mb-4">
                            <img
                                src="/assets/Container 5.png"
                                alt="users"
                                width={90}
                                height={90}
                            />
                        </div>
                        <h3 className="text-lg mb-2 text-[#737b8a] font-semibold">
                            Community
                        </h3>
                        <p className="mb-5 text-sm font-medium">
                            Commodo qui nulla ipsum ea cupidatat sit aliquip
                        </p>
                        <a href="#" className="block text-[#00BDD6] p-2.5 rounded-md">
                            Explore →
                        </a>
                    </div>
                    <div className="w-[300px] h-[280px] bg-[#191919] text-white text-center p-5 m-5 rounded-lg shadow-md">
                        <div className="image-container mb-4">
                            <img
                                src="/assets/Container 7.png"
                                alt="calendar"
                                width={90}
                                height={90}
                            />
                        </div>
                        <h3 className="text-lg mb-2 text-[#737b8a] font-semibold">
                            Events
                        </h3>
                        <p className="mb-5 text-sm font-medium">
                            Commodo qui nulla ipsum ea cupidatat sit aliquip
                        </p>
                        <a href="#" className="block text-[#00BDD6] p-2.5 rounded-md">
                            Explore →
                        </a>
                    </div>
                    <div className="w-[300px] h-[280px] bg-[#191919] text-white text-center p-5 m-5 rounded-lg shadow-md">
                        <div className="image-container mb-4">
                            <img
                                src="/assets/Container.png"
                                alt="code"
                                width={90}
                                height={90}
                            />
                        </div>
                        <h3 className="text-lg mb-2 text-[#737b8a] font-semibold">
                            Hire a Talent
                        </h3>
                        <p className="mb-5 text-sm font-medium">
                            Commodo qui nulla ipsum ea cupidatat sit aliquip
                        </p>
                        <a href="#" className="block text-[#00BDD6] p-2.5 rounded-md">
                            Explore →
                        </a>
                    </div>
                </div>
            </section>

            {/*Job Posting*/}
            <section>
                <div className=" bg-black text-white px-6 py-8 mb-20">
                    <div className="max-w-7xl mx-auto">
                        {/* Header Section */}
                        <h1 className="text-[#00BDD6] text-3xl font-bold">Latest Jobs</h1>
                        <p className="text-gray-400 mb-8">
                            Jobs or projects posted by our alumni
                        </p>

                        {/* Job Cards Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {jobs.map((job, index) => (
                                <div
                                    key={index}
                                    className="bg-[#1E1E1E] rounded-lg p-6 border border-gray-600 hover:border-[#00BDD6] transition-all"
                                >
                                    {/* Job Header */}
                                    <h3 className="text-lg font-semibold mb-2">{job.jobName}</h3>

                                    {/* Job Details */}
                                    <p className="text-sm text-gray-400 mb-2">{job.salaryRange}</p>
                                    <p className="text-sm text-gray-400 mb-4">{job.jobType}</p>

                                    {/* Location */}
                                    <p className="text-sm text-gray-400 mb-4">
                                        📍 {job.location[0]},
                                        <i className="fa fa-home" aria-hidden="true"></i>
                                        {job.location[1]}, {job.location[2]}
                                    </p>

                                    {/* Save Job */}
                                    <button
                                        className="text-[#00BDD6] text-sm font-semibold hover:underline"
                                        onClick={() => console.log(`Saved job: ${job.jobName}`)}
                                    >
                                        Save Job
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Footer Section */}
                        <div className="flex justify-center mt-8">
                            <button className="bg-[#00BDD6] text-black px-6 py-2 rounded-lg font-semibold hover:bg-[#009BB2]">
                                See more
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/*Events*/}
            <section className="bg-black text-white py-10 px-6 mb-20">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold text-cyan-400 mb-8">Latest and Upcoming Events</h2>
                    <div className="space-y-8">
                        {events.map((event) => (
                            <div
                                key={event.id}
                                className="flex flex-col md:flex-row bg-gray-800 rounded-lg shadow-lg overflow-hidden"
                            >
                                <img
                                    src={event.imageUrl}
                                    alt={event.title}
                                    className="h-48 md:h-auto md:w-48 object-cover event-image"
                                />
                                <div className="p-6 flex-1">
                                    <h4 className="text-sm font-semibold text-cyan-500">{event.department}</h4>
                                    <h3 className="text-xl font-bold mt-1">{event.title}</h3>
                                    <p className="text-gray-400 mt-2">{event.description}</p>
                                    <div className="flex justify-between items-center mt-4">
                                        <span className="text-sm text-gray-500">{event.date}</span>
                                        <button className="bg-cyan-500 text-black font-semibold py-2 px-4 rounded-lg hover:bg-cyan-600">
                                            {event.buttonText}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-8 flex justify-center">
                        <button className="bg-cyan-500 text-black font-semibold py-2 px-6 rounded-lg hover:bg-cyan-600">
                            See more
                        </button>
                    </div>
                </div>
            </section>

            {/*Posts By community Section*/}
            <div className="bg-black text-white py-8 px-6 mb-20">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Left Section */}
                    <div className="col-span-2">
                        <div className="flex justify-between mb-4">
                            <button className="text-cyan-500 font-semibold">Most Recent</button>
                            <button className="text-gray-500">Forum</button>
                        </div>
                        <div className="space-y-6">
                            {discussions.map((discussion) => (
                                <div
                                    key={discussion.id}
                                    className="bg-gray-800 rounded-lg p-4 flex space-x-4"
                                >
                                    <img
                                        src={discussion.avatar}
                                        alt={discussion.name}
                                        className="h-12 w-12 rounded-full"
                                    />
                                    <div>
                                        <div className="flex justify-between">
                                            <h3 className="text-sm font-semibold">
                                                {discussion.name} <span className="text-gray-500">{discussion.time}</span>
                                            </h3>
                                        </div>
                                        <h4 className="text-md font-bold">{discussion.message}</h4>
                                        <p className="text-gray-400 text-sm mt-2">{discussion.description}</p>
                                        <div className="flex items-center space-x-4 text-sm text-gray-500 mt-3">
                                            <span>👍 {discussion.likes}</span>
                                            <span>💬 {discussion.comments}</span>
                                            <span>↩ {discussion.shares}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 flex justify-center">
                            <button className="bg-cyan-500 text-black font-semibold py-2 px-6 rounded-lg hover:bg-cyan-600">
                                See more
                            </button>
                        </div>
                    </div>
                    {/* Right Section */}
                    <div>
                        <h4 className="text-cyan-500 font-bold">People are talking about...</h4>
                        <div className="mt-4 flex flex-wrap gap-2">
                            {["Integration", "Onboarding", "Security", "Process", "Advanced Features", "No Code"].map(
                                (topic) => (
                                    <button
                                        key={topic}
                                        className="text-sm bg-gray-700 text-cyan-400 py-1 px-3 rounded-lg"
                                    >
                                        {topic}
                                    </button>
                                )
                            )}
                        </div>
                        <div className="mt-6 bg-gray-800 rounded-lg p-4 text-center">
                            <img
                                src="/images/no-code-trend.jpg"
                                alt="No Code Trend"
                                className="w-full h-48 object-cover rounded-lg"
                            />
                            <h4 className="text-lg font-bold mt-4">No Code Trend</h4>
                            <p className="text-gray-500 text-sm mt-2">
                                Ut sit aute non mollit consequat consequat conse
                            </p>
                            <button className="mt-4 bg-cyan-500 text-black font-semibold py-2 px-6 rounded-lg hover:bg-cyan-600">
                                View article
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default UserDashboard;