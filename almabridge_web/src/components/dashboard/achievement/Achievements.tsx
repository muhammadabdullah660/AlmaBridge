"use client";

import { useState, useMemo, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Achievement } from "@/types";
import AchievementFilter from "./AchievementFilter";
import AchievementForm from "./AchievementForm";
import AchievementList from "./AchievementList";
import NoPlaceholder from "@/components/dashboard/NoPlaceholder";
import { GetAllAchievements } from "@/lib/api/achievementService";
import { toast } from "react-toastify";






export default function Achievements() {
  const [userRole, setUserRole] = useState<"admin" | "student" | "alumni">("student");
  const isAdminOrAlumni = userRole === "admin" || userRole === "alumni";
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null);
  const [currentPage, setCurrentPage] = useState(1); // Pagination state
  const achievementsPerPage = 6; // Number of achievements per page

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const fetchedAchievements = await GetAllAchievements();
        setAchievements(fetchedAchievements);
      } catch (error) {
        console.log(error);
        toast.error("Error Occurred While Loading Achievements");
      }
    };

    fetchAchievements();
  }, []);

  useEffect(() => {
    setUserRole(getUserRole());
  }, []);

  const getUserRole = (): "admin" | "student" | "alumni" => {
    if (typeof window !== "undefined") {
      const role = localStorage.getItem("role") ?? "";
      return (role as "admin" | "student" | "alumni") || "student";
    }
    return "student";
  };

  // Filter states
  const [departmentFilter, setDepartmentFilter] = useState<string>("");
  const [sessionFilter, setSessionFilter] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<"all" | "student" | "alumni" | "other">("all");

  const filteredAchievements = useMemo(() => {
    return achievements.filter((achievement) => {
      const departmentMatch = !departmentFilter || achievement.department === departmentFilter;
      const sessionMatch = !sessionFilter || achievement.session?.toLowerCase().includes(sessionFilter.toLowerCase());
      const categoryMatch = categoryFilter === "all" || achievement.achieverCategory === categoryFilter;
      return departmentMatch && sessionMatch && categoryMatch;
    });
  }, [achievements, departmentFilter, sessionFilter, categoryFilter]);

  const handleAddAchievement = (achievementData: Achievement) => {
    setAchievements((prev) => [achievementData, ...prev]);
    setIsFormOpen(false);
  };

  const handleUpdateAchievement = (achievementData: Achievement) => {
    if (editingAchievement) {
      setAchievements((prev) =>
        prev.map((achievement) =>
          achievement.id === editingAchievement.id ? { ...achievement, ...achievementData } : achievement
        )
      );
      setEditingAchievement(null);
      setIsFormOpen(false);
    }
  };

  const handleEdit = (achievement: Achievement) => {
    setEditingAchievement(achievement);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    setAchievements((prev) => prev.filter((achievement) => achievement.id !== id));
  };

  const handleCloseForm = () => {
    setTimeout(() => {
      setIsFormOpen(false);
      setEditingAchievement(null);
    }, 100);
  };

  const handleFilterChange = {
    department: (value: string) => setDepartmentFilter(value),
    session: (value: string) => setSessionFilter(value),
    category: (value: "all" | "student" | "alumni" | "other") => setCategoryFilter(value),
  };

  // Pagination calculations
  const totalPages = Math.ceil(filteredAchievements.length / achievementsPerPage);
  const paginatedAchievements = filteredAchievements.slice(
    (currentPage - 1) * achievementsPerPage,
    currentPage * achievementsPerPage
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Achievements</h2>
        {isAdminOrAlumni && (
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add New Achievement
          </Button>
        )}
      </div>

      {!isFormOpen && (
        <AchievementFilter
          onDepartmentChange={handleFilterChange.department}
          onSessionChange={handleFilterChange.session}
          onCategoryChange={handleFilterChange.category}
        />
      )}

      {isAdminOrAlumni && (
        <AchievementForm
          isOpen={isFormOpen}
          initialData={editingAchievement}
          onSubmit={editingAchievement ? handleUpdateAchievement : handleAddAchievement}
          onCancel={handleCloseForm}
          isUpdateForm={!!editingAchievement}
        />
      )}

      {!isFormOpen && (
        paginatedAchievements.length > 0 ? (
          <>
            <AchievementList
              achievements={paginatedAchievements}
              onEdit={isAdminOrAlumni ? handleEdit : () => {}}
              onDelete={isAdminOrAlumni ? handleDelete : undefined}
            />
            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-6">
              <Button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
              >
                Previous
              </Button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <Button
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => setCurrentPage((prev) => prev + 1)}
              >
                Next
              </Button>
            </div>
          </>
        ) : (
          <NoPlaceholder
            title="No Achievements Yet"
            description={isAdminOrAlumni ? "Start by adding your first achievement" : "No achievements available to display"}
          />
        )
      )}
    </div>
  );
}