"use client"
import { CheckCircle, Trash2, Calendar, BookOpen } from "lucide-react"

interface TaskCardProps {
  task: any
  onComplete: (id: number) => void
  onDelete: (id: number) => void
}

export default function TaskCard({ task, onComplete, onDelete }: TaskCardProps) {
  const isOverdue = new Date(task.deadline) < new Date() && !task.is_completed

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border-l-4 ${
      task.is_completed ? "border-green-400" :
      isOverdue ? "border-red-400" : "border-blue-400"
    }`}>
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className={`font-semibold dark:text-white ${task.is_completed ? "line-through text-gray-400" : ""}`}>
            {task.title}
          </h3>
          <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full">
            {task.subject}
          </span>
        </div>

        <div className="flex gap-2">
          {!task.is_completed && (
            <button onClick={() => onComplete(task.id)}
              className="p-1.5 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors">
              <CheckCircle className="w-5 h-5" />
            </button>
          )}
          <button onClick={() => onDelete(task.id)}
            className="p-1.5 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
        <span className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          Due: {new Date(task.deadline).toLocaleDateString()}
        </span>
        {isOverdue && <span className="text-red-500 font-medium">⚠️ Overdue</span>}
        {task.is_completed && <span className="text-green-500 font-medium">✅ Completed</span>}
      </div>

      {task.ai_study_plan && (
        <details className="mt-2">
          <summary className="text-xs text-blue-500 cursor-pointer flex items-center gap-1 font-medium">
            <BookOpen className="w-3 h-3" /> View AI Study Plan
          </summary>
          <div className="mt-2 text-xs text-gray-600 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg whitespace-pre-line">
            {task.ai_study_plan}
          </div>
        </details>
      )}
    </div>
  )
}