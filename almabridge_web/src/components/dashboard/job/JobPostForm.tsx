import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Textarea } from "@/components/ui/Textarea"
import { Label } from "@/components/ui/Label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import { Job, JobPostingFormProps } from "@/types"
import { CreateJob, UpdateJob } from "@/lib/api/jobPostService"
import { toast } from "react-toastify"
import { Loader2 } from "lucide-react"

export default function JobPostingForm({
  initialData = null,
  onSubmit,
  onCancel,
  isOpen,
  isUpdateForm,
}: JobPostingFormProps) {
  const parseSalaryRange = (salaryRange: string | undefined) => {
    if (!salaryRange) return { minSalary: "", maxSalary: "" }
    const [min, max] = salaryRange.split("-")
    return { minSalary: min || "", maxSalary: max || "" }
  }

  const [jobId, setJobId] = useState<string | undefined>(initialData?.id)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [formData, setFormData] = useState<Omit<Job, "id">>({
    jobName: initialData?.jobName || "",
    jobDescription: initialData?.jobDescription || "",
    salaryRange: initialData?.salaryRange || "",
    location: initialData?.location || "",
    jobType: initialData?.jobType || "",
  })
  const [salary, setSalary] = useState({
    minSalary: parseSalaryRange(initialData?.salaryRange).minSalary,
    maxSalary: parseSalaryRange(initialData?.salaryRange).maxSalary,
  })

  useEffect(() => {
    setJobId(initialData?.id)
    setFormData({
      jobName: initialData?.jobName || "",
      jobDescription: initialData?.jobDescription || "",
      salaryRange: initialData?.salaryRange || "",
      location: initialData?.location || "",
      jobType: initialData?.jobType || "",
    })
    setSalary(parseSalaryRange(initialData?.salaryRange))
  }, [initialData])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSalary((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const min = parseFloat(salary.minSalary)
    const max = parseFloat(salary.maxSalary)
    if (salary.minSalary && salary.maxSalary && (isNaN(min) || isNaN(max))) {
      toast.error("Please enter valid numbers for salary range")
      setIsSubmitting(false)
      return
    }
    if (salary.minSalary && salary.maxSalary && min > max) {
      toast.error("Minimum salary cannot be greater than maximum salary")
      setIsSubmitting(false)
      return
    }

    const salaryRange = salary.minSalary && salary.maxSalary ? `${salary.minSalary}-${salary.maxSalary}` : ""

    try {
      const updatedFormData = { ...formData, salaryRange }
      if (!isUpdateForm) {
        const createdJob = await CreateJob(updatedFormData)
        setJobId(createdJob.id)
        onSubmit(createdJob)
        // Reset form
        setFormData({
          jobName: "",
          jobDescription: "",
          salaryRange: "",
          location: "",
          jobType: "",
        })
        setSalary({ minSalary: "", maxSalary: "" })
      } else {
        const updatedJob = await UpdateJob(updatedFormData, jobId)
        onSubmit(updatedJob)
      }
    } catch (error) {
      console.error("Error while creating/updating job: ", error)
      toast.error("Failed to create/update job post")
    } finally {
      setIsSubmitting(false)
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
        <h3 className="text-xl font-semibold mb-4">{initialData ? "Edit Job" : "Add New Job"}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="jobName">Job Name *</Label>
            <Input
              id="jobName"
              name="jobName"
              value={formData.jobName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="jobDescription">Job Description *</Label>
            <Textarea
              id="jobDescription"
              name="jobDescription"
              value={formData.jobDescription}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="flex space-x-4">
            <div className="flex-1">
              <Label htmlFor="minSalary">Minimum Salary</Label>
              <Input
                id="minSalary"
                name="minSalary"
                type="number"
                value={salary.minSalary}
                onChange={handleSalaryChange}
                placeholder="e.g., 10000"
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="maxSalary">Maximum Salary</Label>
              <Input
                id="maxSalary"
                name="maxSalary"
                type="number"
                value={salary.maxSalary}
                onChange={handleSalaryChange}
                placeholder="e.g., 20000"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="jobType">Job Type</Label>
            <Select
              onValueChange={(value: "full-time" | "part-time" | "internship" | "contract" | "fellowship") =>
                handleSelectChange("jobType", value)
              }
              value={formData.jobType}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full-time">Full-Time</SelectItem>
                <SelectItem value="part-time">Part-Time</SelectItem>
                <SelectItem value="internship">Internship</SelectItem>
                <SelectItem value="fellowship">Fellowship</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : initialData ? "Update" : "Add Job"}
            </Button>
          </div>
        </form>
      </motion.div>
    </AnimatePresence>
  )
}