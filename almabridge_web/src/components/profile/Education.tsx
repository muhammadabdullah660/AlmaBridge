"use client"

import { memo, useCallback } from "react"
import { Plus, Trash2, GraduationCap } from "lucide-react"
import { Button } from "../ui/Button"
import { Input } from "../ui/Input"
import { Label } from "../ui/Label"
import type { Education } from "@/types"
import SectionCard from "./SectionCard"

interface EducationProps {
  education: Education[]
  isEditing: boolean
  onUpdate: (education: Education[]) => void
}

const EducationSection = memo(({ education, isEditing, onUpdate }: EducationProps) => {
  const addEducation = useCallback(() => {
    onUpdate([...education, { school: "", degree: "", fieldOfStudy: "", graduationYear: "" }])
  }, [education, onUpdate])

  const updateEducation = useCallback(
    (index: number, field: keyof Education, value: string) => {
      const updated = [...education]
      updated[index] = { ...updated[index], [field]: value }
      onUpdate(updated)
    },
    [education, onUpdate],
  )

  const removeEducation = useCallback(
    (index: number) => {
      onUpdate(education.filter((_, i) => i !== index))
    },
    [education, onUpdate],
  )

  return (
    <SectionCard title="Education" icon="🎓">
      <div className="space-y-6">
        {education.map((edu, index) => (
          <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <Label>School/University</Label>
                  <Input
                    value={edu.school}
                    onChange={(e) => updateEducation(index, "school", e.target.value)}
                    placeholder="Institution name"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Degree</Label>
                    <Input
                      value={edu.degree}
                      onChange={(e) => updateEducation(index, "degree", e.target.value)}
                      placeholder="e.g., Bachelor's, Master's"
                    />
                  </div>
                  <div>
                    <Label>Field of Study</Label>
                    <Input
                      value={edu.fieldOfStudy}
                      onChange={(e) => updateEducation(index, "fieldOfStudy", e.target.value)}
                      placeholder="e.g., Computer Science"
                    />
                  </div>
                </div>

                <div>
                  <Label>Graduation Year</Label>
                  <Input
                    value={edu.graduationYear}
                    onChange={(e) => updateEducation(index, "graduationYear", e.target.value)}
                    placeholder="e.g., 2024"
                  />
                </div>

                <Button
                  onClick={() => removeEducation(index)}
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
                    <h3 className="font-semibold text-white">{edu.school}</h3>
                    <p className="text-blue-400">
                      {edu.degree} in {edu.fieldOfStudy}
                    </p>
                    <p className="text-sm text-gray-400">Graduated: {edu.graduationYear}</p>
                  </div>
                  <GraduationCap className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            )}
          </div>
        ))}

        {education.length === 0 && !isEditing && (
          <p className="text-gray-400 text-center py-8">No education added yet</p>
        )}

        {isEditing && (
          <Button
            onClick={addEducation}
            variant="ghost"
            className="w-full text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 border border-dashed border-blue-400/30"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Education
          </Button>
        )}
      </div>
    </SectionCard>
  )
})

EducationSection.displayName = "EducationSection"

export default EducationSection
