"use client"

import { useEffect, useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Job } from "@/types"
import JobPostingForm from "./JobPostForm"
import JobPostingList from "./JobList"
import NoPlaceholder from "../NoPlaceholder"
import { toast } from "react-toastify"
import { GetAllJobs } from "@/lib/api/jobPostService"

export default function JobPost() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingJob, setEditingJob] = useState<Job | null>(null)

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const fetchedJobs = await GetAllJobs();
        setJobs(fetchedJobs);
      } catch (error) {
        console.log(error);
        toast.error("Error Occured While Loading Jobs");
      }
    };

    fetchJobs();
  }, []);

  const handleAddJob = (jobData: Job) => {
    setJobs((prev) => [ jobData , ...prev])
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
    setEditingJob(job)
    setIsFormOpen(true)
  }

  const handleDelete = (id: string) => {
    setJobs((prev) => prev.filter((job) => job.id !== id))
  }

  const handleCloseForm = () => {
    setTimeout(() => {
      setIsFormOpen(false)
      setEditingJob(null)
    }, 100)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Job Postings</h2>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add New Job
        </Button>
      </div>

      <JobPostingForm
        initialData={editingJob}
        onSubmit={editingJob ? handleUpdateJob : handleAddJob}
        onCancel={handleCloseForm}
        isOpen={isFormOpen}
        isUpdateForm={editingJob ? true : false}
      />

      {!isFormOpen && (
        jobs.length > 0 ? (
          <JobPostingList
            jobs={jobs}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isStudent={false}
            onApply={undefined}
          />
        ) : (
          <NoPlaceholder
            title="No Posts Found" 
            description="Create your first post to get started"
          />
        )
      )}
    </div>
  )
}