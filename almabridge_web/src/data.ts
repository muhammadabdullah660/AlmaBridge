import { Users, Briefcase, MessageSquare, Brain, BarChartIcon as ChartBar, Shield, Facebook, Twitter, LinkedinIcon as LinkedIn, Instagram, ThumbsUp, Network
  ,Home, FileText, Activity, Trophy, Lightbulb, Settings, CreditCard, HelpCircle
} from "lucide-react"
import { TeamMember, Notification } from "./types";

// export const members: member[] = [
//     {
//       name: "Muhammad Abdullah",
//       position: "Lead Developer",
//       img: "/assets/me.webp",
//     },
//     {
//       name: "Fatima Awais",
//       position: "Lead Developer",
//       img: "/assets/fatima.webp",
//     },
//     {
//       name: "Muhammad Shahzaib Ijaz",
//       position: "Lead Developer",
//       img: "/assets/shahzaib.webp",
//     },
//     {
//       name: "Zoya Naveed",
//       position: "Lead Developer",
//       img: "/assets/zoya.webp",
//     },
// ];

export const faqs = [
  {
    question: "How does AlmaBridge match students with mentors?",
    answer:
      "AlmaBridge uses advanced AI algorithms to analyze profiles, interests, and career goals to create the most compatible student-mentor matches.",
  },
  {
    question: "Is AlmaBridge free for students?",
    answer:
      "Yes, AlmaBridge is free for students. We believe in providing equal opportunities for all students to access mentorship and career guidance.",
  },
  {
    question: "How can alumni get involved?",
    answer:
      "Alumni can sign up as mentors on our platform. They can set their availability, areas of expertise, and preferences for mentoring.",
  },
  {
    question: "What kind of support does AlmaBridge offer?",
    answer:
      "AlmaBridge offers mentorship, job placement assistance, skill development resources, and networking opportunities for both students and alumni.",
  },
];

export const gender = ["Male", "Female", "Other"]


export const features = [
  {
    icon: Brain,
    title: "AI-Powered Matchmaking",
    description:
      "Our advanced algorithms ensure perfect mentor-student matches based on goals, interests, and expertise.",
  },
  {
    icon: Users,
    title: "Global Network",
    description: "Connect with mentors and peers from prestigious institutions worldwide.",
  },
  {
    icon: Briefcase,
    title: "Career Opportunities",
    description: "Access exclusive job postings and internship opportunities from partner companies.",
  },
  {
    icon: MessageSquare,
    title: "Seamless Communication",
    description: "Built-in chat, video calls, and collaboration tools for effective mentorship.",
  },
  {
    icon: ChartBar,
    title: "Progress Tracking",
    description: "Monitor your growth with detailed analytics and milestone tracking.",
  },
  {
    icon: Shield,
    title: "Verified Network",
    description: "All mentors are verified professionals from top institutions and companies.",
  },
]


export const socialIcons = [
  { Icon: Facebook, href: "#", hoverColor: "hover:text-[#1877F2]" },
  { Icon: Twitter, href: "#", hoverColor: "hover:text-[#1DA1F2]" },
  { Icon: LinkedIn, href: "#", hoverColor: "hover:text-[#0A66C2]" },
  { Icon: Instagram, href: "#", hoverColor: "hover:text-[#E4405F]" },
]

export const footerLinks = ["All Jobs", "Alumni Highlights", "Community Posts", "Latest Events", "Donate"]


export const metrics = [
  { value: "90%", label: "Candidate match rate", icon: Users },
  { value: "95%", label: "Alumni satisfaction rate", icon: ThumbsUp },
  { value: "1200+", label: "Active connections", icon: Network },
]

export const scrambleText = "Transform your career journey with AlmaBridge - where innovation meets opportunity, and dreams become reality."

export const highlightWords = ["Transform", "innovation", "opportunity", "dreams"]

export const teamMembers: TeamMember[] = [
  {
    name: "Muhammad Abdullah",
    role: "Lead Developer",
    image: "/assets/abdullah.webp",
    bio: "Full-stack developer skilled in web development, SaaS, and tech mentoring.",
  },
  {
    name: "Muhammad Shahzaib",
    role: "Lead Developer",
    image: "/assets/shahzaib.webp",
    bio: "Digital magician casting spells with code that *somehow* works, fueled by Lotus Cake."
  },
  {
    name: "Fatima Awais",
    role: "Lead Developer",
    image: "/assets/fatima.webp",
    bio: "Developer, dedicated to driving innovation and collaborating for impactful solutions.",
  },
  {
    name: "Zoya Naveed",
    role: "Lead Developer",
    image: "/assets/zoya.webp",
    bio: "Developer, dedicated to crafting intuitive, and impactful UX with a touch of creativity.",
  },
]


export const placeholderRoutes = ["teams", "activity", "people", "suggestions", "settings" ,"messages", "reports", "billing", "help"]

export const notifications: Notification[] = [
  {
    id: 1,
    title: "New Connection",
    message: "Sarah Lee has accepted your connection request",
    time: "5m ago",
    unread: true,
  },
  {
    id: 2,
    title: "New Job Match",
    message: "A new job matching your profile has been posted",
    time: "1h ago",
    unread: true,
  },
  {
    id: 3,
    title: "Mentorship Session",
    message: "Upcoming session with John Doe tomorrow",
    time: "2h ago",
    unread: false,
  },
]

export const menuItems = [
  {
    category: "MAIN MENU",
    items: [
      { icon: Home, label: "Home", href: "/dashboard" },
      { icon: Users, label: "Teams", href: "/dashboard/teams" },
      { icon: Activity, label: "Activity", href: "/dashboard/activity" },
      { icon: MessageSquare, label: "Messages", href: "/dashboard/messages" },
      { icon: FileText, label: "Reports", href: "/dashboard/reports" },
    ],
  },
  {
    category: "FEATURES",
    items: [
      { icon: Trophy, label: "Achievements", href: "/dashboard/achievements" },
      { icon: Users, label: "People you Know", href: "/dashboard/people" },
      { icon: Lightbulb, label: "Suggestions", href: "/dashboard/suggestions" },
      { icon: Briefcase, label: "Jobs", href: "/dashboard/jobs" },
    ],
  },
  {
    category: "SETTINGS",
    items: [
      { icon: Settings, label: "Settings", href: "/dashboard/settings" },
      { icon: CreditCard, label: "Billing", href: "/dashboard/billing" },
      { icon: HelpCircle, label: "Help & Support", href: "/dashboard/help" },
    ],
  },
]


export const performanceData = [
  { name: "Mon", value: 65 },
  { name: "Tue", value: 75 },
  { name: "Wed", value: 85 },
  { name: "Thu", value: 70 },
  { name: "Fri", value: 90 },
]

export const pieData = [
  { name: "Active", value: 65 },
  { name: "Inactive", value: 35 },
]

export const COLORS = ["#8B5CF6", "#1F2937"]

export const departments = ["Computer Science", "Computer Engineering", "Mechatronics", "Civil Engineering"]
