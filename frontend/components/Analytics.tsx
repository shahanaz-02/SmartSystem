"use client"
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell, ResponsiveContainer, Legend
} from "recharts"

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"]

export default function Analytics({ data }: { data: any }) {
  if (!data) return null

  const barData = Object.entries(data.tasks_by_subject || {}).map(([name, value]) => ({
    name, value
  }))

  const pieData = [
    { name: "Completed", value: data.completed_tasks },
    { name: "Pending", value: data.pending_tasks },
    { name: "Overdue", value: data.overdue_tasks },
  ].filter(d => d.value > 0)

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Pie Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <h3 className="font-semibold mb-4 dark:text-white">Task Status</h3>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie data={pieData} dataKey="value" nameKey="name"
              cx="50%" cy="50%" outerRadius={80} label>
              {pieData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Bar Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <h3 className="font-semibold mb-4 dark:text-white">Tasks by Subject</h3>
        {barData.length === 0 ? (
          <p className="text-gray-400 text-sm">No data yet</p>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData}>
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}