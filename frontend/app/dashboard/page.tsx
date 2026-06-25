"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/Navbar"
import { api } from "@/lib/api"
import { CheckCircle, Clock, AlertTriangle, FileText, Brain } from "lucide-react"

export default function Dashboard() {
  const router = useRouter()
  const [student, setStudent] = useState<any>(null)
  const [analytics, setAnalytics] = useState<any>(null)
  const [tasks, setTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const s = localStorage.getItem("student")
    const t = localStorage.getItem("token")
    if (!s || !t) { router.push("/login"); return }
    setStudent(JSON.parse(s))
    loadData()
  }, [])

  const loadData = async () => {
    const [a, t] = await Promise.all([api.getAnalytics(), api.getTasks()])
    setAnalytics(a)
    setTasks(t)
    setLoading(false)
  }

  const tips = [
    "Study in 25-minute Pomodoro sessions 🍅",
    "Review notes within 24 hours of class 📚",
    "Teach concepts to others to master them 🎓",
    "Start assignments 3 days before deadline ⏰",
    "Stay hydrated while studying 💧",
  ]
  const tip = tips[new Date().getDay() % tips.length]

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
    </div>
  )

  const pendingTasks = tasks.filter(t => !t.is_completed).slice(0, 3)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold dark:text-white">
            Welcome back, {student?.name?.split(" ")[0]} 👋
          </h1>
          <p className="text-gray-500 mt-1">{student?.branch} • {student?.year}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Tasks", value: analytics?.total_tasks ?? 0, icon: Clock, color: "blue" },
            { label: "Completed", value: analytics?.completed_tasks ?? 0, icon: CheckCircle, color: "green" },
            { label: "Pending", value: analytics?.pending_tasks ?? 0, icon: Clock, color: "yellow" },
            { label: "Overdue", value: analytics?.overdue_tasks ?? 0, icon: AlertTriangle, color: "red" },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
              <div className={`text-${color}-500 mb-2`}>
                <Icon className="w-6 h-6" />
              </div>
              <div className="text-2xl font-bold dark:text-white">{value}</div>
              <div className="text-sm text-gray-500">{label}</div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Pending Tasks */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4 dark:text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-500" /> Pending Tasks
            </h2>
            {pendingTasks.length === 0 ? (
              <p className="text-gray-400 text-sm">No pending tasks 🎉</p>
            ) : (
              <div className="space-y-3">
                {pendingTasks.map(task => (
                  <div key={task.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <p className="font-medium text-sm dark:text-white">{task.title}</p>
                      <p className="text-xs text-gray-400">{task.subject}</p>
                    </div>
                    <span className="text-xs text-red-500 font-medium">
                      {new Date(task.deadline).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* AI Tip + Notices */}
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-6 text-white shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="w-5 h-5" />
                <h2 className="font-semibold">AI Tip of the Day</h2>
              </div>
              <p className="text-blue-100 text-sm">{tip}</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-5 h-5 text-blue-500" />
                <h2 className="font-semibold dark:text-white">Notices</h2>
              </div>
              <p className="text-gray-500 text-sm">
                {analytics?.total_notices ?? 0} notices summarized
              </p>
              <p className="text-gray-500 text-sm mt-1">
                Completion rate: {analytics?.completion_rate ?? 0}%
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}