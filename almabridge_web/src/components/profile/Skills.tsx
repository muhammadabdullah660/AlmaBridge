"use client"

import { memo, useCallback } from "react"
import { Plus, Trash2 } from "lucide-react"
import { Button } from "../ui/Button"
import { Input } from "../ui/Input"
import { Label } from "../ui/Label"
import type { Skill } from "@/types"
import SectionCard from "./SectionCard"

interface SkillsProps {
  skills: Skill[]
  isEditing: boolean
  onUpdate: (skills: Skill[]) => void
}

const SkillsSection = memo(({ skills, isEditing, onUpdate }: SkillsProps) => {
  const addSkill = useCallback(() => {
    onUpdate([...skills, { name: "", rating: 5 }])
  }, [skills, onUpdate])

  const updateSkill = useCallback(
    (index: number, field: keyof Skill, value: string | number) => {
      const updated = [...skills]
      updated[index] = { ...updated[index], [field]: value }
      onUpdate(updated)
    },
    [skills, onUpdate],
  )

  const removeSkill = useCallback(
    (index: number) => {
      onUpdate(skills.filter((_, i) => i !== index))
    },
    [skills, onUpdate],
  )

  return (
    <SectionCard title="Skills" icon="⚡">
      <div className="space-y-6">
        {skills.map((skill, index) => (
          <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <Label>Skill Name</Label>
                  <Input
                    value={skill.name}
                    onChange={(e) => updateSkill(index, "name", e.target.value)}
                    placeholder="e.g., JavaScript, React, Python"
                  />
                </div>

                <div>
                  <Label>Proficiency Level ({skill.rating}/10)</Label>
                  <Input
                    type="range"
                    min="1"
                    max="10"
                    value={skill.rating}
                    onChange={(e) => updateSkill(index, "rating", Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                <Button
                  onClick={() => removeSkill(index)}
                  variant="ghost"
                  size="sm"
                  className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Remove
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-white">{skill.name}</span>
                  <span className="text-sm text-gray-400">{skill.rating}/10</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-teal-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(skill.rating / 10) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        ))}

        {skills.length === 0 && !isEditing && <p className="text-gray-400 text-center py-8">No skills added yet</p>}

        {isEditing && (
          <Button
            onClick={addSkill}
            variant="ghost"
            className="w-full text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 border border-dashed border-blue-400/30"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Skill
          </Button>
        )}
      </div>
    </SectionCard>
  )
})

SkillsSection.displayName = "SkillsSection"

export default SkillsSection
