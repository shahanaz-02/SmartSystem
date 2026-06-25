"use client"
import Link from "next/link"
import { useTheme } from "next-themes"
import { Moon, Sun, GraduationCap, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"

export default function Navbar() {
  const { theme, setTheme } = useTheme()
  const router = useRouter()

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("student")
    router.push("/login")
  }

  return (
    <nav className="border-b bg-white dark:bg-gray-900 px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
      {/* Logo */}
      <Link href="/dashboard" className="flex items-center gap-2">
        <GraduationCap className="text-blue-600 w-7 h-7" />
        <span className="text-xl font-bold text-blue-600">CampusFlow</span>
      </Link>

      {/* Nav Links */}
      <div className="hidden md:flex items-center gap-6 text-sm font-medium">
        <Link href="/dashboard"
          className="hover:text-blue-600 transition-colors">
          Dashboard
        </Link>
        <Link href="/tasks"
          className="hover:text-blue-600 transition-colors">
          Tasks
        </Link>
        <Link href="/notices"
          className="hover:text-blue-600 transition-colors">
          Notices
        </Link>
        <Link href="/analytics"
          className="hover:text-blue-600 transition-colors">
          Analytics
        </Link>
        <Link href="/rag"
          className="hover:text-blue-600 transition-colors">
          Ask AI
        </Link>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Dark mode toggle */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          {theme === "dark"
            ? <Sun className="w-5 h-5 text-yellow-400" />
            : <Moon className="w-5 h-5 text-gray-600" />
          }
        </button>

        {/* Logout */}
        <button
          onClick={logout}
          className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </nav>
  )
}