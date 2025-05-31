import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { departments } from "@/data";
import { AchievementFilterProps } from "@/types";

export default function AchievementFilter({
  onDepartmentChange,
  onSessionChange,
  onCategoryChange,
}: AchievementFilterProps) {
  const [departmentFilter, setDepartmentFilter] = useState<string>("");
  const [sessionFilter, setSessionFilter] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<"all" | "student" | "alumni" | "other">("all");

  const handleDepartmentChange = (value: string) => {
    setDepartmentFilter(value);
    onDepartmentChange(value);
  };

  const handleSessionChange = (value: string) => {
    setSessionFilter(value);
    onSessionChange(value);
  };

  const handleCategoryChange = (value: "all" | "student" | "alumni" | "other") => {
    setCategoryFilter(value);
    onCategoryChange(value);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="bg-white/5 p-4 rounded-lg flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <Label htmlFor="departmentFilter">Department</Label>
            <Select onValueChange={handleDepartmentChange} value={departmentFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem> {/* Changed value to empty string for no filter */}
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <Label htmlFor="sessionFilter">Session</Label>
            <Input
              id="sessionFilter"
              value={sessionFilter}
              onChange={(e) => handleSessionChange(e.target.value)}
              placeholder="Filter by session"
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <Label htmlFor="categoryFilter">Achiever Category</Label>
            <Select onValueChange={handleCategoryChange} value={categoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="alumni">Alumni</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}