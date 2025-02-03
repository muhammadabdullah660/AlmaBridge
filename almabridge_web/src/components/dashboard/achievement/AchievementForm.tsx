import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Textarea } from "@/components/ui/Textarea"
import { Label } from "@/components/ui/Label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import { Achievement, AchievementFormProps } from "@/types"
import { departments } from "@/data"
import { toast } from "react-toastify"
import { CreateAcievement, UpdateAchievement } from "@/lib/api/achievementService"



export default function AchievementForm({ 
  isOpen, 
  initialData = null, 
  onSubmit, 
  onCancel,
  isUpdateForm
}: AchievementFormProps) {

  const [achievementId, setAchievementId] = useState<string | undefined>(initialData?.id);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [token, setToken] = useState<string>("");

  const [formData, setFormData] = useState<Omit<Achievement, "id">>({
    achievementName: initialData?.achievementName || "",
    achieverName: initialData?.achieverName || "",
    description: initialData?.description || "",
    department: initialData?.department || "",
    session: initialData?.session || "",
    link: initialData?.link || "",
    achievementPicture: initialData?.achievementPicture || "",
    achieverCategory: initialData?.achieverCategory || "student",
  });

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
    e.preventDefault()

    if (token === "") {
      toast.error("Token not Found");
      return;
    }
    setIsSubmitting(true);

    try {
      if (!isUpdateForm) {
        const createdAchievement = await CreateAcievement(formData, token);
        setAchievementId(createdAchievement.id);
        onSubmit(createdAchievement);
      } else {
        const updateAchievement = await UpdateAchievement(formData, token, achievementId);
        onSubmit(updateAchievement);
      }
    } catch(error) {
      console.error("Error while creating job: ", error);
      toast.error("Failed to create or Updating a job post");
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
        <h3 className="text-xl font-semibold mb-4">
          {initialData ? "Edit Achievement" : "Add New Achievement"}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="achievementName">Achievement Name *</Label>
            <Input
              id="achievementName"
              name="achievementName"
              value={formData.achievementName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="achieverName">Achiever Name *</Label>
            <Input
              id="achieverName"
              name="achieverName"
              value={formData.achieverName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="department">Department *</Label>
            <Select 
              onValueChange={(value) => handleSelectChange("department", value)} 
              value={formData.department}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="session">Session</Label>
            <Input 
              id="session" 
              name="session" 
              value={formData.session} 
              onChange={handleInputChange} 
            />
          </div>
          <div>
            <Label htmlFor="link">Link</Label>
            <Input 
              id="link" 
              name="link" 
              value={String(formData.link)} 
              onChange={handleInputChange} 
            />
          </div>
          <div>
            <Label htmlFor="image">Image URL</Label>
            <Input 
              id="image" 
              name="image" 
              value={String(formData.achievementPicture)} 
              onChange={handleInputChange} 
            />
          </div>
          <div>
            <Label htmlFor="achieverCategory">Achiever Category *</Label>
            <Select
              onValueChange={(value: "student" | "alumni" | "other") =>
                handleSelectChange("achieverCategory", value)
              }
              value={formData.achieverCategory}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="alumni">Alumni</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}> { isSubmitting ? "Submitting..." :  initialData ? "Update" : "Add Achievement"} </Button>
          </div>
        </form>
      </motion.div>
    </AnimatePresence>
  )
}