"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { api } from "@../../lib/api"
import { GraduationCap } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [form, setForm] = useState({ email: "", password: "" })

  const handle = (e: any) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async () => {
    setLoading(true)
    setError("")
    try {
      const res = await api.login(form)
      if (res.access_token) {
        localStorage.setItem("token", res.access_token)
        localStorage.setItem("student", JSON.stringify(res.student))
        router.push("/dashboard")
      } else {
        setError(res.detail || "Login failed")
      }
    } catch {
      setError("Something went wrong")
    }
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 w-full max-w-sm">
        <div className="flex items-center gap-2 mb-6">
          <GraduationCap className="text-blue-600 w-7 h-7" />
          <h1 className="text-2xl font-bold text-blue-600">CampusFlow</h1>
        </div>
        <h2 className="text-xl font-semibold mb-1 dark:text-white">Welcome Back</h2>
        <p className="text-gray-500 text-sm mb-6">Login to your account</p>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 text-sm p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <div className="space-y-3">
          <input
            name="email" type="email" placeholder="Email Address"
            value={form.email} onChange={handle}
            className="w-full border dark:border-gray-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
          />
          <input
            name="password" type="password" placeholder="Password"
            value={form.password} onChange={handle}
            className="w-full border dark:border-gray-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
          />
        </div>

        <button
          onClick={submit}
          disabled={loading}
          className="w-full mt-5 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-center text-sm text-gray-500 mt-4">
          Don't have an account?{" "}
          <Link href="/register" className="text-blue-600 font-medium hover:underline">
            Register
          </Link>
        </p>
      </div>
    </main>
  )
}