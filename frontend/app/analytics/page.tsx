"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/Navbar"
import Analytics from "@/components/Analytics"
import { api } from "@/lib/api"
import { TrendingUp } from "lucide-react"

export default function AnalyticsPage() {
  const router = useRouter()
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    if (!localStorage.getItem("token")) { router.push("/login"); return }
    api.getAnalytics().then(setData)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="w-6 h-6 text-blue-500" />
          <h1 className="text-2xl font-bold dark:text-white">Analytics</h1>
        </div>

        {/* Stats Row */}
        {data && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: "Completion Rate", value: `${data.completion_rate}%`, color: "green" },
              { label: "Total Notices", value: data.total_notices, color: "purple" },
              { label: "Total Tasks", value: data.total_tasks, color: "blue" },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm text-center">
                <div className={`text-3xl font-bold text-${color}-500`}>{value}</div>
                <div className="text-sm text-gray-500 mt-1">{label}</div>
              </div>
            ))}
          </div>
        )}

        <Analytics data={data} />
      </main>
    </div>
  )
}