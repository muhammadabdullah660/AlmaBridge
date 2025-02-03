"use client"

import { useState, useMemo, useEffect } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Achievement } from "@/types"
import AchievementFilter from "./AchievementFilter"
import AchievementForm from "./AchievementForm"
import AchievementList from "./AchievementList"
import NoPlaceholder from "@/components/dashboard/NoPlaceholder"
import { GetAllAchievements } from "@/lib/api/achievementService"
import { toast } from "react-toastify"

export default function Achievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null)


  useEffect(() => {

    const fetchAchievements = async () => {
      try{
        const fetchedAchievements = await GetAllAchievements();
        setAchievements(fetchedAchievements);
      } catch (error) {
        console.log(error);
        toast.error("Error Occured While Loading Achievements");
      }
    }

    fetchAchievements();
  }, []);




  // Filter states
  const [departmentFilter, setDepartmentFilter] = useState<string>("")
  const [sessionFilter, setSessionFilter] = useState<string>("")
  const [categoryFilter, setCategoryFilter] = useState<"all" | "student" | "alumni" | "other">("all")

  const filteredAchievements = useMemo(() => {
    return achievements.filter((achievement) => {
      const departmentMatch = !departmentFilter || achievement.department === departmentFilter
      const sessionMatch = !sessionFilter || achievement.session?.toLowerCase().includes(sessionFilter.toLowerCase())
      const categoryMatch = categoryFilter === "all" || achievement.achieverCategory === categoryFilter
      return departmentMatch && sessionMatch && categoryMatch
    })
  }, [achievements, departmentFilter, sessionFilter, categoryFilter])

  const handleAddAchievement = (achievementData: Achievement) => {
    setAchievements((prev) => [achievementData, ...prev])
    setIsFormOpen(false)
  }

  const handleUpdateAchievement = (achievementData: Achievement) => {
    if (editingAchievement) {
      setAchievements((prev) =>
        prev.map((achievement) =>
          achievement.id === editingAchievement.id ? { ...achievement, ...achievementData } : achievement
        )
      )
      setEditingAchievement(null)
      setIsFormOpen(false)
    }
  }

  const handleEdit = (achievement: Achievement) => {
    setEditingAchievement(achievement)
    setIsFormOpen(true)
  }

  const handleDelete = (id: string) => {
    setAchievements((prev) => prev.filter((achievement) => achievement.id !== id))
  }

  const handleCloseForm = () => {
    setTimeout(() => {
      setIsFormOpen(false)
      setEditingAchievement(null)
    }, 100)
  }

  const handleFilterChange = {
    department: (value: string) => setDepartmentFilter(value),
    session: (value: string) => setSessionFilter(value),
    category: (value: "all" | "student" | "alumni" | "other") => setCategoryFilter(value)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Achievements</h2>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add New Achievement
        </Button>
      </div>

      {!isFormOpen && (
        <AchievementFilter
          onDepartmentChange={handleFilterChange.department}
          onSessionChange={handleFilterChange.session}
          onCategoryChange={handleFilterChange.category}
        />
      )}

      <AchievementForm
        isOpen={isFormOpen}
        initialData={editingAchievement}
        onSubmit={editingAchievement ? handleUpdateAchievement : handleAddAchievement}
        onCancel={handleCloseForm}
        isUpdateForm={editingAchievement ? true : false}
      />

      {!isFormOpen && (
        filteredAchievements.length > 0 ? (
          <AchievementList
            achievements={filteredAchievements}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ) : (
          <NoPlaceholder
            title="No Achievements Yet"
            description="Start by adding your first achievement"
          />
        )
      )}
    </div>
  )
}