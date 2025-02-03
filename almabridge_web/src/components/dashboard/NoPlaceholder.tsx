import { FileSearch } from "lucide-react"
import { NoPlaceholderProps } from "@/types"


export default function NoPlaceholder({ 
  icon = <FileSearch className="h-16 w-16 text-gray-400" />,
  title = "No Job Postings Yet",
  description = "Start by adding your first job posting",
  className = ""
}: NoPlaceholderProps) {
  return (
    <div className={`flex flex-col items-center justify-center space-y-4 p-8 bg-white/5 rounded-lg text-center ${className}`}>
      {icon}
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-gray-500">{description}</p>
    </div>
  )
}