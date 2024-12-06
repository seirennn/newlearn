import {
  LucideProps,
  Moon,
  SunMedium,
  Twitter,
  Check,
  Home,
  BookOpen,
  GraduationCap,
  BarChart2,
  Settings,
  LogOut,
  User,
  Bell,
  FileText,
  type Icon as LucideIcon,
} from "lucide-react"

export type Icon = typeof LucideIcon

export const Icons = {
  sun: SunMedium,
  moon: Moon,
  twitter: Twitter,
  check: Check,
  home: Home,
  courses: BookOpen,
  learning: GraduationCap,
  analytics: BarChart2,
  settings: Settings,
  logout: LogOut,
  user: User,
  notifications: Bell,
  resources: FileText,
  spinner: (props: LucideProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  ),
}
