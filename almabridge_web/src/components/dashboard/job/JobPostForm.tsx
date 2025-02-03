import React, { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Textarea } from "@/components/ui/Textarea"
import { Label } from "@/components/ui/Label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import { Job, JobPostingFormProps } from "@/types"
import { CreateJob, UpdateJob } from "@/lib/api/jobPostService"
import { toast } from "react-toastify"


export default function JobPostingForm({ 
  initialData = null, 
  onSubmit, 
  onCancel, 
  isOpen,
  isUpdateForm,
}: JobPostingFormProps) {

  const [jobId, setJobId] = useState<string | undefined>(initialData?.id);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [token, setToken] = useState<string>("");
  const [formData, setFormData] = useState<Omit<Job, "id">>({
    jobName: initialData?.jobName || "",
    jobDescription: initialData?.jobDescription || "",
    salaryRange: initialData?.salaryRange || "",
    location: initialData?.location || "",
    jobType: initialData?.jobType || "",
  })


  useEffect(() => {
      if (typeof window !== "undefined") {
        const storedToken = localStorage.getItem("token");
        setToken(storedToken || "");
      }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (token === "") {
      toast.error("Token not found");
      return;
    }

    setIsSubmitting(true);
    try{
      if(!isUpdateForm) {
        const createdJob = await CreateJob(formData, token);
        setJobId(createdJob.id);
        onSubmit(createdJob);
      } else {
        const updatedJob = await UpdateJob(formData, token, jobId);
        onSubmit(updatedJob);
      }
    } catch(error) {
      console.error("Error while creating job: ", error);
      toast.error("Failed to create a job post");
    } finally {
      setIsSubmitting(false);
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
          <div>
            <Label htmlFor="salaryRange">Salary Range</Label>
            <Input 
              id="salaryRange" 
              name="salaryRange" 
              value={formData.salaryRange} 
              onChange={handleInputChange} 
            />
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
              {isSubmitting ? "Submitting..." : initialData ? "Update" : "Add Job"}
            </Button>
          </div>
        </form>
      </motion.div>
    </AnimatePresence>
  )
}