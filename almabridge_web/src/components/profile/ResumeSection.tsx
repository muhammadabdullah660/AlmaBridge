"use client"

import type React from "react"

import { memo, useCallback } from "react"
import { FileText, Upload } from "lucide-react"
import { Input } from "../ui/Input"
import SectionCard from "./SectionCard"

interface ResumeSectionProps {
  isEditing: boolean
  onResumeUpload: (file: File) => void
}

const ResumeSection = memo(({ isEditing, onResumeUpload }: ResumeSectionProps) => {
  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        onResumeUpload(file)
      }
    },
    [onResumeUpload],
  )

  return (
    <SectionCard title="Resume" icon="📄">
      {isEditing ? (
        <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-blue-400 transition-colors duration-200">
          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-400 mb-4">Upload your resume to auto-fill profile information</p>
          <Input type="file" accept=".pdf" onChange={handleFileChange} className="max-w-xs mx-auto" />
        </div>
      ) : (
        <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg border border-white/10">
          <FileText className="w-6 h-6 text-blue-400" />
          <div>
            <p className="text-white font-medium">Resume.pdf</p>
            <a href="#" className="text-blue-400 hover:text-blue-300 text-sm transition-colors duration-200">
              View Resume
            </a>
          </div>
        </div>
      )}
    </SectionCard>
  )
})

ResumeSection.displayName = "ResumeSection"

export default ResumeSection
