"use client"

import { memo, useCallback } from "react"
import { Plus, Trash2, Award } from "lucide-react"
import { Button } from "../ui/Button"
import { Input } from "../ui/Input"
import { Label } from "../ui/Label"
import type { Certification } from "@/types"
import SectionCard from "./SectionCard"

interface CertificationsProps {
  certifications: Certification[]
  isEditing: boolean
  onUpdate: (certifications: Certification[]) => void
}

const CertificationsSection = memo(({ certifications, isEditing, onUpdate }: CertificationsProps) => {
  const addCertification = useCallback(() => {
    onUpdate([...certifications, { name: "", issuer: "", date: "" }])
  }, [certifications, onUpdate])

  const updateCertification = useCallback(
    (index: number, field: keyof Certification, value: string) => {
      const updated = [...certifications]
      updated[index] = { ...updated[index], [field]: value }
      onUpdate(updated)
    },
    [certifications, onUpdate],
  )

  const removeCertification = useCallback(
    (index: number) => {
      onUpdate(certifications.filter((_, i) => i !== index))
    },
    [certifications, onUpdate],
  )

  return (
    <SectionCard title="Certifications" icon="🏆">
      <div className="space-y-6">
        {certifications.map((cert, index) => (
          <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <Label>Certification Name</Label>
                  <Input
                    value={cert.name}
                    onChange={(e) => updateCertification(index, "name", e.target.value)}
                    placeholder="e.g., AWS Certified Developer"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Issuer</Label>
                    <Input
                      value={cert.issuer}
                      onChange={(e) => updateCertification(index, "issuer", e.target.value)}
                      placeholder="e.g., Amazon Web Services"
                    />
                  </div>
                  <div>
                    <Label>Date</Label>
                    <Input
                      type="date"
                      value={cert.date}
                      onChange={(e) => updateCertification(index, "date", e.target.value)}
                    />
                  </div>
                </div>

                <Button
                  onClick={() => removeCertification(index)}
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
                    <h3 className="font-semibold text-white">{cert.name}</h3>
                    <p className="text-blue-400">{cert.issuer}</p>
                    <p className="text-sm text-gray-400">{cert.date}</p>
                  </div>
                  <Award className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            )}
          </div>
        ))}

        {certifications.length === 0 && !isEditing && (
          <p className="text-gray-400 text-center py-8">No certifications added yet</p>
        )}

        {isEditing && (
          <Button
            onClick={addCertification}
            variant="ghost"
            className="w-full text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 border border-dashed border-blue-400/30"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Certification
          </Button>
        )}
      </div>
    </SectionCard>
  )
})

CertificationsSection.displayName = "CertificationsSection"

export default CertificationsSection
