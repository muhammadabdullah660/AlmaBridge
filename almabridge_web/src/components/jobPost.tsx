'use client';

import { useState, useEffect } from 'react';
import { FaEdit, FaTrashAlt, FaPlus } from 'react-icons/fa';
import { Typewriter } from 'react-simple-typewriter';
import axios from "axios";


interface Jobs {
    Id?: string
    jobName: string;
    jobDescription: string;
    salaryRange: string;
    location: [string, string, string]; // [city, state, country]
    postedById: Number;
    jobType: string;
}

const JobPost = () => {
    const [selectedJob, setSelectedJob] = useState<any>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editableJob, setEditableJob] = useState<any>(null);
    const [isAdding, setIsAdding] = useState(false);
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

    const handleJobClick = (job: any) => {
        setSelectedJob(job);
        setEditableJob({ ...job });
        setDialogOpen(true);
        setIsEditing(false);
        setIsAdding(false);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
        setSelectedJob(null);
        setIsEditing(false);
        setIsAdding(false);
    };

    const handleAddJob = () => {
        setEditableJob({
            jobName: '',
            jobDescription: '',
            salaryRange: '',
            jobType: '',
            location: '',
        });
        setDialogOpen(true);
        setIsAdding(true);
    };

    const handleSaveChanges = async () => {
        try {
            let response;
            if (isAdding) {
                // API call for adding a job
                response = await fetch("http://127.0.0.1:3001/api/jobposting/create", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(editableJob),
                });
            } else {
                // API call for updating a job
                response = await fetch(`http://127.0.0.1:3001/api/jobposting/update/${selectedJob.id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(editableJob),
                });
            }

            if (response.ok) {
                const updatedJob = await response.json();

                setJobs((prev) => {
                    if (isAdding) {
                        // Add new job to the state
                        return [...prev, updatedJob];
                    } else {
                        // Update the edited job in the state
                        return prev.map((job) =>
                            job.Id === updatedJob.id ? updatedJob : job
                        );
                    }
                });
                console.log("Job Done Successfully");
                // Close the dialog after successful update
                handleDialogClose();
            } else {
                console.error("Failed to save changes:", await response.text());
            }
        } catch (error) {
            console.error("Error saving changes:", error);
        }
    };


    const handleDeleteJob = async () => {
        try {
            // API call to delete the job
            const response = await fetch(`http://127.0.0.1:3001/api/jobposting/delete/${selectedJob.id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                // Update the frontend by removing the deleted job
                setJobs(jobs.filter((job) => job !== selectedJob));
                console.log("Job deleted successfully");
                handleDialogClose();
            } else {
                console.error("Failed to delete job:", await response.text());
            }
        } catch (error) {
            console.error("Error deleting job:", error);
        }
    };


    const handleChange = (field: string, value: any) => {
        setEditableJob((prev: any) => ({
            ...prev,
            [field]: value,
        }));
    };

    return (
        <div className="min-h-screen bg-black text-white">
            <h1 className="text-center text-3xl font-extrabold text-[#00BDD6] my-12">
                <Typewriter
                    words={['Job Postings']}
                    loop={false}
                    cursor
                    cursorStyle="_"
                    typeSpeed={100}
                    deleteSpeed={40}
                    delaySpeed={1000}
                />
            </h1>

            {/* Job Posts Grid */}
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
                                onClick={() => handleJobClick(job)}

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
                </div>
            </div>


            {/* Floating Add Button */}
            <button
                className="fixed bottom-6 right-6 bg-[#00BDD6] text-white p-4 rounded-full shadow-lg hover:scale-110 transition duration-300"
                onClick={handleAddJob}
            >
                <FaPlus size={20} />
            </button>

            {/* View/Edit/Add/Delete Modal */}
            {dialogOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-black p-6 rounded-lg w-full max-w-4xl max-h-[80vh] overflow-auto text-white">
                        <h3 className="text-2xl text-[#00BDD6] mb-4 font-bold">
                            {isAdding ? 'Add Job Details' : isEditing ? 'Edit Job Details' : 'Job Details'}
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-[#00BDD6] font-bold mb-2">
                                    Title:
                                </label>
                                {isAdding || isEditing ? (
                                    <input
                                        type="text"
                                        value={editableJob.jobName}
                                        onChange={(e) => handleChange('jobName', e.target.value)}
                                        className="w-full p-2 rounded border border-gray-500 bg-gray-800 text-white"
                                    />
                                ) : (
                                    <p>{selectedJob.jobName}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-[#00BDD6] font-bold mb-2">
                                    Description:
                                </label>
                                {isAdding || isEditing ? (
                                    <textarea
                                        value={editableJob.jobDescription}
                                        onChange={(e) => handleChange('jobDescription', e.target.value)}
                                        className="w-full p-2 rounded border border-gray-500 bg-gray-800 text-white"
                                    />
                                ) : (
                                    <p>{selectedJob.jobDescription}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-[#00BDD6] font-bold mb-2">
                                    Salary Range:
                                </label>
                                {isAdding || isEditing ? (
                                    <input
                                        type="text"
                                        value={editableJob.salaryRange}
                                        onChange={(e) => handleChange('salaryRange', e.target.value)}
                                        className="w-full p-2 rounded border border-gray-500 bg-gray-800 text-white"
                                    />
                                ) : (
                                    <p>{selectedJob.salaryRange}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-[#00BDD6] font-bold mb-2">
                                    Type:
                                </label>
                                {isAdding || isEditing ? (
                                    <input
                                        type="text"
                                        value={editableJob.jobType}
                                        onChange={(e) => handleChange('jobType', e.target.value)}
                                        className="w-full p-2 rounded border border-gray-500 bg-gray-800 text-white"
                                    />
                                ) : (
                                    <p>{selectedJob.jobType}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-[#00BDD6] font-bold mb-2">Location:</label>
                                {isAdding || isEditing ? (
                                    <input
                                        type="text"
                                        placeholder="City, State, Country"
                                        value={editableJob.location} // Join array into a string for the input field
                                        onChange={(e) => {
                                            const [city, state, country] = e.target.value.split(',').map(item => item.trim());
                                            // Ensure we always have exactly 3 values, otherwise fallback to empty strings
                                            handleChange('location', [city , state, country]);
                                        }}
                                        className="w-full p-2 rounded border border-gray-500 bg-gray-800 text-white"
                                    />
                                ) : (
                                    <p>{selectedJob.location.join(", ")}</p> // Display as a string for non-editing mode
                                )}
                            </div>


                            <div>
                                <label className="block text-[#00BDD6] font-bold mb-2">
                                    PostedById:
                                </label>
                                {isAdding || isEditing ? (
                                    <input
                                        type="text"
                                        value={editableJob.postedById}
                                        onChange={(e) => handleChange('postedById', e.target.value)}
                                        className="w-full p-2 rounded border border-gray-500 bg-gray-800 text-white"
                                    />
                                ) : (
                                    <p>{selectedJob.postedById}</p>
                                )}
                            </div>

                        </div>

                        <div className="flex justify-between mt-6">
                            <button
                                className="bg-gray-500 text-white px-6 py-2 rounded-lg"
                                onClick={handleDialogClose}
                            >
                                Close
                            </button>
                            {(isAdding || isEditing) && (
                                <button
                                    className="bg-green-500 text-white px-6 py-2 rounded-lg"
                                    onClick={handleSaveChanges}
                                >
                                    Save
                                </button>
                            )}
                            {!isAdding && !isEditing && (
                                <div className="flex space-x-4">
                                    <button
                                        className="bg-yellow-500 text-white px-6 py-2 rounded-lg flex items-center"
                                        onClick={() => setIsEditing(true)}
                                    >
                                        <FaEdit className="mr-2" /> Edit
                                    </button>
                                    <button
                                        className="bg-red-500 text-white px-6 py-2 rounded-lg flex items-center"
                                        onClick={handleDeleteJob}
                                    >
                                        <FaTrashAlt className="mr-2" /> Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JobPost;