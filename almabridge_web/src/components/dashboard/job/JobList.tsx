import React, { useState } from "react"
import { motion } from "framer-motion"
import { Edit, Trash2, X } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { JobPostingListProps } from "@/types"
import { toast } from "react-toastify"
import { DeleteJob } from "@/lib/api/jobPostService"

export default function JobPostingList({ jobs, onEdit, onDelete, isStudent, onApply }: JobPostingListProps) {
  const [showModal, setShowModal] = useState<boolean>(false)
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null)

  const closeModal = () => {
    setShowModal(false)
    setSelectedJobId(null)
  }

  const handleDeleteJob = async (jobId: string) => {
    try {
      const message = await DeleteJob(jobId)
      toast.success(message)
      onDelete(jobId)
    } catch (error) {
      console.log(error)
      toast.error("Error Occurred While Deleting the Job")
    } finally {
      closeModal()
    }
  }

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <motion.div
          key={job.id}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-white/5 p-4 rounded-lg hover:bg-accent hover:cursor-pointer"
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{job.jobName}</h3>
              <p className="text-sm text-gray-400 line-clamp-2">{job.jobDescription}</p>
              <div className="mt-2 space-y-1">
                {job.salaryRange && (
                  <p className="text-sm text-gray-400">
                    <span className="font-medium">Salary:</span> {job.salaryRange}
                  </p>
                )}
                {job.location && (
                  <p className="text-sm text-gray-400">
                    <span className="font-medium">Location:</span> {job.location}
                  </p>
                )}
                {job.jobType && (
                  <p className="text-sm text-gray-400">
                    <span className="font-medium">Type:</span> {job.jobType}
                  </p>
                )}
              </div>
            </div>
            <div className="flex space-x-2 ml-4">
              {!isStudent ? (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    className="hover:text-green-400 transition-colors"
                    onClick={() => onEdit(job)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="hover:text-red-500 transition-colors"
                    onClick={() => {
                      setSelectedJobId(job.id)
                      setShowModal(true)
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                onApply && (
                  <Button
                    size="sm"
                    variant="default"
                    onClick={() => onApply(job)}
                    className="whitespace-nowrap"
                  >
                    Apply Now
                  </Button>
                )
              )}
            </div>
          </div>

          {showModal && selectedJobId === job.id && (
            <motion.div
              className="fixed inset-0 flex items-center justify-center bg-black/50"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
            >
              <div className="relative w-full max-w-md p-6 rounded-lg backdrop-blur-md bg-black/30 border border-gray-700/50 shadow-xl">
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
                <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-red-500/10 mb-4">
                  <svg
                    className="w-6 h-6 text-red-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-medium text-white mb-2">
                    Are you sure you want to delete this job?
                  </h3>
                  <p className="text-gray-300 mb-4">
                    This action cannot be undone.
                  </p>
                  <div className="flex justify-center gap-4">
                    <button
                      onClick={closeModal}
                      className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 text-white transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleDeleteJob(job.id)}
                      className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white transition"
                    >
                      Sure
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      ))}
    </div>
  )
}