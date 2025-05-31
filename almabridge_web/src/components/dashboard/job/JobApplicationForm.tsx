import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Textarea } from "@/components/ui/Textarea"
import { Label } from "@/components/ui/Label"
import { JobApplicationFormProps, JobApplication } from "@/types"
import { Loader2 } from "lucide-react"
import { toast } from "react-toastify"

export default function JobApplicationForm({
  job,
  onSubmit,
  onCancel,
  isOpen,
}: JobApplicationFormProps) {
  const [formData, setFormData] = useState<JobApplication>({
    jobId: job.id,
    resume: null,
    linkedin: "",
    github: "",
    description: "",
  })
  const [isUploading, setIsUploading] = useState(false)

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    if (file && file.size > 5 * 1024 * 1024) {
      toast.error("Resume file size must be less than 5MB")
      return
    }
    if (file && !["application/pdf"].includes(file.type)) {
      toast.error("Only PDF files are allowed")
      return
    }
    setFormData((prev) => ({ ...prev, resume: file }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUploading(true)

    if (!formData.resume) {
      toast.error("Please upload a resume")
      setIsUploading(false)
      return
    }

    try {
      await onSubmit(formData)
    } catch (error) {
      console.error("Error submitting application:", error)
      toast.error("Failed to submit application")
    } finally {
      setIsUploading(false)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-white/5 p-6 rounded-lg"
      >
        <h3 className="text-xl font-semibold mb-4">Apply for {job.jobName}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="resume">Resume (PDF) *</Label>
            <Input
              id="resume"
              name="resume"
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="linkedin">LinkedIn Profile</Label>
            <Input
              id="linkedin"
              name="linkedin"
              value={formData.linkedin}
              onChange={handleInputChange}
              placeholder="https://linkedin.com/in/your-profile"
            />
          </div>
          <div>
            <Label htmlFor="github">GitHub Profile</Label>
            <Input
              id="github"
              name="github"
              value={formData.github}
              onChange={handleInputChange}
              placeholder="https://github.com/your-profile"
            />
          </div>
          <div>
            <Label htmlFor="description">About Yourself *</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Tell us about yourself and why you're a good fit"
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isUploading}>
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Application"
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </AnimatePresence>
  )
}