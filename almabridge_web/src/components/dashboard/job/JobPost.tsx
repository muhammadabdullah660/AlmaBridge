'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Job, JobApplication } from '@/types';
import JobPostingForm from './JobPostForm';
import JobPostingList from './JobList';
import JobApplicationForm from './JobApplicationForm';
import NoPlaceholder from '../NoPlaceholder';
import { toast } from 'react-toastify';
import { GetAllJobs, GetSpecificAlumniJobs, SubmitJobApplication } from '@/lib/api/jobPostService';

export default function JobPost() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [applyingJob, setApplyingJob] = useState<Job | null>(null);
  const [userRole, setUserRole] = useState<'admin' | 'student' | 'alumni'>('student');

  useEffect(() => {
    setUserRole(getUserRole());
  }, []);


  useEffect(() => {
    const fetchJobs = async () => {
      try {
        if (userRole === 'alumni') {
          const fetchedSpecificJobs = await GetSpecificAlumniJobs();
          setJobs(fetchedSpecificJobs);
        } else {
          const fetchedJobs = await GetAllJobs();
          setJobs(fetchedJobs);
        }
      } catch (error) {
        console.error(error);
        toast.error('Error Occurred While Loading Jobs');
      }
    };

    fetchJobs();
  }, [userRole]);

  

  const getUserRole = (): 'admin' | 'student' | 'alumni' => {
    if (typeof window !== 'undefined') {
      const role = localStorage.getItem('role') ?? '';
      return (role as 'admin' | 'student' | 'alumni') || 'student';
    }
    return 'student';
  };

  const handleAddJob = (jobData: Job) => {
    setJobs((prev) => [jobData, ...prev]);
    setIsFormOpen(false);
    setCurrentPage(1); // Reset to first page to show new job
  };

  const handleUpdateJob = (jobData: Job) => {
    if (editingJob) {
      setJobs((prev) =>
        prev.map((job) => (job.id === editingJob.id ? { ...job, ...jobData } : job))
      );
      setEditingJob(null);
      setIsFormOpen(false);
    }
  };

  const handleEdit = (job: Job) => {
    setEditingJob(job);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    setJobs((prev) => prev.filter((job) => job.id !== id));
    if (paginatedJobs.length === 1 && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleApply = (job: Job) => {
    setApplyingJob(job);
    setIsFormOpen(true);
  };

  const handleSubmitApplication = async (application: JobApplication) => {
    try {
      await SubmitJobApplication(application);
      toast.success('Application submitted successfully');
      setApplyingJob(null);
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error('Failed to submit application');
    }
  };

  const handleCloseForm = () => {
    setTimeout(() => {
      setIsFormOpen(false);
      setEditingJob(null);
      setApplyingJob(null);
    }, 100);
  };

  const totalPages = Math.ceil(jobs.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedJobs = jobs.slice(startIndex, startIndex + pageSize);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const getPageNumbers = () => {
    const maxPagesToShow = 5;
    const pages: (number | string)[] = [];

    pages.push(1);

    const sidePages = Math.floor(maxPagesToShow / 2);
    let startPage = Math.max(2, currentPage - sidePages);
    let endPage = Math.min(totalPages - 1, currentPage + sidePages);

    if (currentPage <= sidePages + 1) {
      endPage = Math.min(totalPages - 1, maxPagesToShow - 1);
    }
    if (currentPage >= totalPages - sidePages) {
      startPage = Math.max(2, totalPages - maxPagesToShow + 1);
    }

    if (startPage > 2) {
      pages.push('...');
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages - 1) {
      pages.push('...');
    }

    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <section className="py-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/50 to-black" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="flex justify-between items-center mb-8"
        >
          <h2 className="text-3xl md:text-4xl font-bold font-space-grotesk">
            Job Postings
          </h2>
          {(userRole === 'admin' || userRole === 'alumni') && (
            <Button onClick={() => setIsFormOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add New Job
            </Button>
          )}
        </motion.div>

        {(userRole === 'admin' || userRole === 'alumni') && (
          <JobPostingForm
            initialData={editingJob}
            onSubmit={editingJob ? handleUpdateJob : handleAddJob}
            onCancel={handleCloseForm}
            isOpen={isFormOpen && !applyingJob}
            isUpdateForm={!!editingJob}
          />
        )}

        {userRole === 'student' && applyingJob && (
          <JobApplicationForm
            job={applyingJob}
            onSubmit={handleSubmitApplication}
            onCancel={handleCloseForm}
            isOpen={isFormOpen && !!applyingJob}
          />
        )}

        {!isFormOpen && (
          <>
            {jobs.length > 0 ? (
              <>
                <JobPostingList
                  jobs={paginatedJobs}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  isStudent={userRole === 'student'}
                  onApply={userRole === 'student' ? handleApply : undefined}
                />
                {totalPages > 1 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="mt-12 flex justify-center items-center gap-4"
                  >
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-4 py-2 bg-white/10 text-white rounded-lg border border-white/20 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                    >
                      Previous
                    </button>
                    <div className="flex gap-2">
                      {getPageNumbers().map((page, index) => (
                        <button
                          key={`${page}-${index}`}
                          onClick={() => typeof page === 'number' && handlePageChange(page)}
                          disabled={typeof page !== 'number'}
                          className={`px-4 py-2 rounded-lg border border-white/20 transition-all duration-300 ${
                            currentPage === page
                              ? 'bg-white/20 text-white'
                              : typeof page === 'number'
                              ? 'bg-white/10 text-gray-300 hover:bg-white/15'
                              : 'bg-white/10 text-gray-500 cursor-default'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 bg-white/10 text-white rounded-lg border border-white/20 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                    >
                      Next
                    </button>
                    <Select
                      value={pageSize.toString()}
                      onValueChange={(value) => {
                        setPageSize(parseInt(value));
                        setCurrentPage(1);
                      }}
                    >
                      <SelectTrigger className="w-24 bg-white/10 border-white/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5 per page</SelectItem>
                        <SelectItem value="10">10 per page</SelectItem>
                        <SelectItem value="20">20 per page</SelectItem>
                      </SelectContent>
                    </Select>
                  </motion.div>
                )}
              </>
            ) : (
              <NoPlaceholder
                title="No Posts Found"
                description="No jobs available at the moment."
              />
            )}
          </>
        )}
      </div>
    </section>
  );
}