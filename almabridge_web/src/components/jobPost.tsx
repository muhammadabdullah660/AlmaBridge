'use client';

import { useState } from 'react';
import { FaEdit, FaTrashAlt, FaPlus } from 'react-icons/fa';
import { Typewriter } from 'react-simple-typewriter';

const JobPost = () => {
    const [jobPosts, setJobPosts] = useState([
        {
            jobName: 'UI/UX Designer',
            jobDescription: 'Design amazing user interfaces.',
            salaryRange: '$100,000 - $120,000',
            jobType: 'Remote',
            location: 'New York, USA',
        },
        {
            jobName: 'UI/UX Designer',
            jobDescription: 'Design amazing user interfaces.',
            salaryRange: '$100,000 - $120,000',
            jobType: 'Remote',
            location: 'New York, USA',
        },
        {
            jobName: 'UI/UX Designer',
            jobDescription: 'Design amazing user interfaces.',
            salaryRange: '$100,000 - $120,000',
            jobType: 'Remote',
            location: 'New York, USA',
        },
        {
            jobName: 'UI/UX Designer',
            jobDescription: 'Design amazing user interfaces.',
            salaryRange: '$100,000 - $120,000',
            jobType: 'Remote',
            location: 'New York, USA',
        },
        {
            jobName: 'UI/UX Designer',
            jobDescription: 'Design amazing user interfaces.',
            salaryRange: '$100,000 - $120,000',
            jobType: 'Remote',
            location: 'New York, USA',
        },
        {
            jobName: 'UI/UX Designer',
            jobDescription: 'Design amazing user interfaces.',
            salaryRange: '$100,000 - $120,000',
            jobType: 'Remote',
            location: 'New York, USA',
        },

    ]);

    const [selectedJob, setSelectedJob] = useState<any>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editableJob, setEditableJob] = useState<any>(null);
    const [isAdding, setIsAdding] = useState(false);

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

    const handleSaveChanges = () => {
        if (isAdding) {
            setJobPosts((prev) => [...prev, { ...editableJob }]);
        } else {
            setJobPosts((prev) =>
                prev.map((job) =>
                    job === selectedJob ? { ...editableJob } : job
                )
            );
        }
        handleDialogClose();
    };

    const handleDeleteJob = () => {
        if (selectedJob) {
            setJobPosts(jobPosts.filter((job) => job !== selectedJob));
            handleDialogClose();
        }
    };

    const handleChange = (field: string, value: string) => {
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-6 mb-10">
                {jobPosts.map((job, index) => (
                    <div
                        key={index}
                        onClick={() => handleJobClick(job)}
                        className="p-6 rounded-lg border border-[#00BDD6] shadow-xl hover:scale-105 transition transform duration-300 cursor-pointer"
                        style={{
                            background: 'linear-gradient(to bottom, #000000, #4b4b4b)', // Black to gray gradient
                            display: 'flex', // Flexbox for centering content
                            flexDirection: 'column', // Stack content vertically
                            justifyContent: 'center', // Center content vertically
                            alignItems: 'center', // Center content horizontally
                        }}
                    >
                        <h3 className="text-xl font-bold mb-2 text-center">{job.jobName}</h3>
                        <p className="mb-2 text-center">{job.jobDescription}</p>
                        <p className="text-center">
                            <strong>Salary Range:</strong> {job.salaryRange}
                        </p>
                        <p className="text-center">
                            <strong>Type:</strong> {job.jobType}
                        </p>
                        <p className="text-center">
                            <strong>Location:</strong> {job.location}
                        </p>
                    </div>
                ))}
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
                                <label className="block text-[#00BDD6] font-bold mb-2">
                                    Location:
                                </label>
                                {isAdding || isEditing ? (
                                    <input
                                        type="text"
                                        value={editableJob.location}
                                        onChange={(e) => handleChange('location', e.target.value)}
                                        className="w-full p-2 rounded border border-gray-500 bg-gray-800 text-white"
                                    />
                                ) : (
                                    <p>{selectedJob.location}</p>
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