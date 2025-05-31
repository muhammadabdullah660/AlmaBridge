"use client"

import { useEffect, useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Job, JobApplication, UserRole } from "@/types"
import JobPostingForm from "./JobPostForm"
import JobPostingList from "./JobList"
import JobApplicationForm from "./JobApplicationForm"
import NoPlaceholder from "../NoPlaceholder"
import { toast } from "react-toastify"
import { GetAllJobs, SubmitJobApplication } from "@/lib/api/jobPostService"

interface JobPostProps {
  userRole: UserRole;
}

export default function JobPost({ userRole }: JobPostProps) {
  const [jobs, setJobs] = useState<Job[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingJob, setEditingJob] = useState<Job | null>(null)
  const [applyingJob, setApplyingJob] = useState<Job | null>(null)

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const fetchedJobs = await GetAllJobs();
        setJobs(fetchedJobs);
      } catch (error) {
        console.log(error);
        toast.error("Error Occurred While Loading Jobs");
      }
    };

    fetchJobs();
  }, []);

  const handleAddJob = (jobData: Job) => {
    setJobs((prev) => [jobData, ...prev])
    setIsFormOpen(false)
  }

  const handleUpdateJob = (jobData: Job) => {
    if (editingJob) {
      setJobs((prev) =>
        prev.map((job) =>
          job.id === editingJob.id ? { ...job, ...jobData } : job
        )
      )
      setEditingJob(null)
      setIsFormOpen(false)
    }
  }

  const handleEdit = (job: Job) => {
    console.log(job);
    setEditingJob(job)
    setIsFormOpen(true)
  }

  const handleDelete = (id: string) => {
    setJobs((prev) => prev.filter((job) => job.id !== id))
  }

  const handleApply = (job: Job) => {
    setApplyingJob(job)
    setIsFormOpen(true)
  }

  const handleSubmitApplication = async (application: JobApplication) => {
    try {
      await SubmitJobApplication(application);
      toast.success("Application submitted successfully");
      setApplyingJob(null)
      setIsFormOpen(false)
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error("Failed to submit application");
    }
  }

  const handleCloseForm = () => {
    setTimeout(() => {
      setIsFormOpen(false)
      setEditingJob(null)
      setApplyingJob(null)
    }, 100)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Job Postings</h2>
        {(userRole === 'admin' || userRole === 'alumni') && (
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add New Job
          </Button>
        )}
      </div>

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
        jobs.length > 0 ? (
          <JobPostingList
            jobs={jobs}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isStudent={userRole === 'student'}
            onApply={userRole === 'student' ? handleApply : undefined}
          />
        ) : (
          <NoPlaceholder
            title="No Posts Found"
            description="No jobs available at the moment."
          />
        )
      )}
    </div>
  )
}