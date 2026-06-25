"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/Navbar"
import TaskCard from "@/components/TaskCard"
import VoiceInput from "@/components/VoiceInput"
import { api } from "@/lib/api"
import { Plus, X } from "lucide-react"

export default function TasksPage() {
  const router = useRouter()
  const [tasks, setTasks] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    title: "", subject: "", deadline: "", add_to_calendar: true
  })

  useEffect(() => {
    if (!localStorage.getItem("token")) { router.push("/login"); return }
    loadTasks()
  }, [])

  const loadTasks = async () => {
    const data = await api.getTasks()
    setTasks(Array.isArray(data) ? data : [])
  }

  const handle = (e: any) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async () => {
    if (!form.title || !form.subject || !form.deadline) return
    setLoading(true)
    await api.createTask({
      ...form,
      deadline: new Date(form.deadline).toISOString()
    })
    setForm({ title: "", subject: "", deadline: "", add_to_calendar: true })
    setShowForm(false)
    await loadTasks()
    setLoading(false)
  }

  const complete = async (id: number) => {
    await api.completeTask(id)
    loadTasks()
  }

  const remove = async (id: number) => {
    await api.deleteTask(id)
    loadTasks()
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold dark:text-white">My Tasks</h1>
          <button onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors">
            {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {showForm ? "Cancel" : "Add Task"}
          </button>
        </div>

        {/* Create Task Form */}
        {showForm && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm mb-6">
            <h2 className="font-semibold mb-4 dark:text-white">Create New Task</h2>
            <div className="space-y-3">
              {/* Voice Input for title */}
              <VoiceInput
                onResult={(text) => setForm({ ...form, title: text })}
              />
              <input
                name="title" placeholder="Task Title"
                value={form.title} onChange={handle}
                className="w-full border dark:border-gray-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
              <input
                name="subject" placeholder="Subject (e.g. Operating Systems)"
                value={form.subject} onChange={handle}
                className="w-full border dark:border-gray-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
              <input
                name="deadline" type="datetime-local"
                value={form.deadline} onChange={handle}
                className="w-full border dark:border-gray-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
              <label className="flex items-center gap-2 text-sm dark:text-gray-300">
                <input type="checkbox"
                  checked={form.add_to_calendar}
                  onChange={e => setForm({ ...form, add_to_calendar: e.target.checked })}
                  className="rounded"
                />
                Add to Google Calendar
              </label>
            </div>
            <button onClick={submit} disabled={loading}
              className="mt-4 w-full bg-blue-600 text-white py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50">
              {loading ? "Creating + Generating AI Plan..." : "Create Task"}
            </button>
          </div>
        )}

        {/* Task List */}
        <div className="space-y-4">
          {tasks.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-lg">No tasks yet</p>
              <p className="text-sm">Click "Add Task" to create your first task</p>
            </div>
          ) : (
            tasks.map(task => (
              <TaskCard key={task.id} task={task}
                onComplete={complete} onDelete={remove} />
            ))
          )}
        </div>
      </main>
    </div>
  )
}