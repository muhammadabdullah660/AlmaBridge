"use client"

import { memo, useCallback } from "react"
import { Plus, Trash2, Briefcase } from "lucide-react"
import { Button } from "../ui/Button"
import { Input } from "../ui/Input"
import { Textarea } from "../ui/Textarea"
import { Label } from "../ui/Label"
import type { WorkExperience } from "@/types"
import SectionCard from "./SectionCard"

interface WorkExperienceProps {
  workExperience: WorkExperience[]
  isEditing: boolean
  onUpdate: (workExperience: WorkExperience[]) => void
}

const WorkExperienceSection = memo(({ workExperience, isEditing, onUpdate }: WorkExperienceProps) => {
  const addWorkExperience = useCallback(() => {
    onUpdate([...workExperience, { company: "", role: "", startDate: "", endDate: "", description: "" }])
  }, [workExperience, onUpdate])

  const updateWorkExperience = useCallback(
    (index: number, field: keyof WorkExperience, value: string) => {
      const updated = [...workExperience]
      updated[index] = { ...updated[index], [field]: value }
      onUpdate(updated)
    },
    [workExperience, onUpdate],
  )

  const removeWorkExperience = useCallback(
    (index: number) => {
      onUpdate(workExperience.filter((_, i) => i !== index))
    },
    [workExperience, onUpdate],
  )

  return (
    <SectionCard title="Work Experience" icon="💼">
      <div className="space-y-6">
        {workExperience.map((experience, index) => (
          <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
            {isEditing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Company</Label>
                    <Input
                      value={experience.company}
                      onChange={(e) => updateWorkExperience(index, "company", e.target.value)}
                      placeholder="Company name"
                    />
                  </div>
                  <div>
                    <Label>Role</Label>
                    <Input
                      value={experience.role}
                      onChange={(e) => updateWorkExperience(index, "role", e.target.value)}
                      placeholder="Job title"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Start Date</Label>
                    <Input
                      type="date"
                      value={experience.startDate}
                      onChange={(e) => updateWorkExperience(index, "startDate", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>End Date</Label>
                    <Input
                      type="date"
                      value={experience.endDate}
                      onChange={(e) => updateWorkExperience(index, "endDate", e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={experience.description}
                    onChange={(e) => updateWorkExperience(index, "description", e.target.value)}
                    placeholder="Describe your role and achievements..."
                    rows={3}
                  />
                </div>

                <Button
                  onClick={() => removeWorkExperience(index)}
                  variant="ghost"
                  size="sm"
                  className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Remove
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-white">{experience.role}</h3>
                    <p className="text-blue-400">{experience.company}</p>
                    <p className="text-sm text-gray-400">
                      {experience.startDate} - {experience.endDate || "Present"}
                    </p>
                  </div>
                  <Briefcase className="w-5 h-5 text-gray-400" />
                </div>
                {experience.description && <p className="text-gray-300 text-sm mt-2">{experience.description}</p>}
              </div>
            )}
          </div>
        ))}

        {workExperience.length === 0 && !isEditing && (
          <p className="text-gray-400 text-center py-8">No work experience added yet</p>
        )}

        {isEditing && (
          <Button
            onClick={addWorkExperience}
            variant="ghost"
            className="w-full text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 border border-dashed border-blue-400/30"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Work Experience
          </Button>
        )}
      </div>
    </SectionCard>
  )
})

WorkExperienceSection.displayName = "WorkExperienceSection"

export default WorkExperienceSection
