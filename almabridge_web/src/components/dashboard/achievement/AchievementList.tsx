import { motion } from "framer-motion";
import Image from "next/image";
import { LinkIcon, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { AchievementListProps } from "@/types";
import { useState } from "react";
import { toast } from "react-toastify";
import { DeleteAchievement } from "@/lib/api/achievementService";
import { X } from "lucide-react";

export default function AchievementList({
  achievements,
  onEdit,
  onDelete,
}: AchievementListProps) {
  const [showModal, setShowModal] = useState<string | null>(null); // Track which achievement to delete
  const isEditable = !!onEdit && !!onDelete; // Determine if edit/delete is allowed

  const handleDeleteAchievement = async (achievementId: string) => {
    try {
      const message = await DeleteAchievement(achievementId);
      toast.success(message);
      onDelete?.(achievementId); // Safe call with optional chaining
    } catch (error) {
      console.error(error); // Use console.error for errors
      toast.error("Error Occurred While Deleting the Achievement");
    } finally {
      setShowModal(null);
    }
  };

  const closeModal = () => {
    setShowModal(null);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {achievements.map((achievement) => (
        <motion.div
          key={achievement.id}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-white/5 rounded-lg overflow-hidden flex flex-col"
        >
          <div className="relative h-48">
            <Image
              src={achievement.achievementPicture || "/placeholder.svg"}
              alt={achievement.achievementName}
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
          <div className="p-4 flex-1 flex flex-col">
            <h3 className="text-lg font-semibold mb-2">
              {achievement.link ? (
                <a href={achievement.link} target="_blank" rel="noopener noreferrer" className="flex items-center">
                  {achievement.achievementName}
                  <LinkIcon className="ml-2 h-4 w-4" />
                </a>
              ) : (
                achievement.achievementName
              )}
            </h3>
            <p className="text-sm text-gray-400 mb-2">{achievement.achieverName}</p>
            <p className="text-sm text-gray-400 mb-4 line-clamp-6">{achievement.description}</p>
            <div className="mt-auto flex justify-between items-center text-xs text-gray-500">
              <span>{achievement.department}</span>
              {achievement.session && <span>{achievement.session}</span>}
            </div>
            <div className="mt-2 text-xs text-gray-500">Category: {achievement.achieverCategory}</div>
          </div>
          {isEditable && (
            <div className="p-4 bg-white/5 flex justify-end space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onEdit?.(achievement)} // Safe call with optional chaining
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowModal(achievement.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}

          {showModal === achievement.id && (
            <motion.div
              className="fixed inset-0 flex items-center justify-center bg-black/50"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
            >
              <div className="relative w-full max-w-md p-6 rounded-lg backdrop-blur-md bg-black/30 border border-gray-700/50 shadow-xl">
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
                <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-red-500/10 mb-4">
                  <svg
                    className="w-6 h-6 text-red-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-medium text-white mb-2">
                    Are you sure you want to delete this Achievement?
                  </h3>
                  <p className="text-gray-300 mb-4">
                    This action cannot be undone.
                  </p>
                  <div className="flex justify-center gap-4">
                    <button
                      onClick={closeModal}
                      className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 text-white transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleDeleteAchievement(achievement.id)}
                      className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white transition"
                    >
                      Sure
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      ))}
    </div>
  );
}