import JobPostCRUD from "@/components/dashboard/job/JobPost";

const getUserRole = (): "admin" | "student" | "alumni" => {
    if (typeof window !== "undefined") {
      const role = localStorage.getItem("role") ?? "";
      return (role as "admin" | "student" | "alumni") || "student";
    }
    return "student";
  };


export default function JobPostPage() {
    const userRole = getUserRole();
    return <JobPostCRUD userRole={userRole} />;
}