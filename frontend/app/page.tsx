import Link from "next/link"
import { GraduationCap, Bell, Brain, BarChart3 } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero */}
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-6">
        <div className="flex items-center gap-3 mb-6">
          <GraduationCap className="w-14 h-14 text-blue-600" />
          <h1 className="text-5xl font-bold text-blue-600">CampusFlow</h1>
        </div>

        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-xl mb-4">
          Your AI-powered student productivity platform.
          Never miss a deadline again.
        </p>

        <p className="text-gray-500 dark:text-gray-400 max-w-lg mb-10">
          Smart deadline manager • Notice summarizer • RAG AI assistant •
          Telegram reminders • Google Calendar sync
        </p>

        {/* Features */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { icon: Bell, label: "Telegram Reminders" },
            { icon: Brain, label: "AI Study Plans" },
            { icon: BarChart3, label: "Analytics" },
            { icon: GraduationCap, label: "RAG AI" },
          ].map(({ icon: Icon, label }) => (
            <div key={label}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm flex flex-col items-center gap-2">
              <Icon className="w-8 h-8 text-blue-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex gap-4">
          <Link href="/register"
            className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg">
            Get Started
          </Link>
          <Link href="/login"
            className="bg-white dark:bg-gray-800 text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-lg border">
            Login
          </Link>
        </div>
      </div>
    </main>
  )
}