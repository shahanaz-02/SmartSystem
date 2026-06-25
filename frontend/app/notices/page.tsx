"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/Navbar"
import NoticeCard from "@/components/NoticeCard"
import { api } from "@/lib/api"
import { Plus, X } from "lucide-react"

export default function NoticesPage() {
  const router = useRouter()
  const [notices, setNotices] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [text, setText] = useState("")
  const [eventDate, setEventDate] = useState("")

  useEffect(() => {
    if (!localStorage.getItem("token")) { router.push("/login"); return }
    loadNotices()
  }, [])

  const loadNotices = async () => {
    const data = await api.getNotices()
    setNotices(Array.isArray(data) ? data : [])
  }

  const submit = async () => {
    if (!text.trim()) return
    setLoading(true)
    await api.createNotice({
      original_text: text,
      event_date: eventDate ? new Date(eventDate).toISOString() : null
    })
    setText("")
    setEventDate("")
    setShowForm(false)
    await loadNotices()
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold dark:text-white">Notices</h1>
          <button onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-xl hover:bg-purple-700 transition-colors">
            {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {showForm ? "Cancel" : "Add Notice"}
          </button>
        </div>

        {showForm && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm mb-6">
            <h2 className="font-semibold mb-4 dark:text-white">Summarize a Notice</h2>
            <div className="space-y-3">
              <textarea
                placeholder="Paste your full notice text here..."
                value={text} onChange={e => setText(e.target.value)}
                rows={6}
                className="w-full border dark:border-gray-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white resize-none"
              />
              <input type="datetime-local"
                value={eventDate} onChange={e => setEventDate(e.target.value)}
                className="w-full border dark:border-gray-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <button onClick={submit} disabled={loading}
              className="mt-4 w-full bg-purple-600 text-white py-2.5 rounded-xl font-medium hover:bg-purple-700 transition-colors disabled:opacity-50">
              {loading ? "Summarizing with AI..." : "Summarize & Send to Telegram"}
            </button>
          </div>
        )}

        <div className="space-y-4">
          {notices.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-lg">No notices yet</p>
              <p className="text-sm">Paste a notice to get an AI summary</p>
            </div>
          ) : (
            notices.map(n => <NoticeCard key={n.id} notice={n} />)
          )}
        </div>
      </main>
    </div>
  )
}