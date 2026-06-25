"use client"
import { FileText, Calendar, Send } from "lucide-react"

export default function NoticeCard({ notice }: { notice: any }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border-l-4 border-purple-400">
      <div className="flex items-center gap-2 mb-3">
        <FileText className="w-4 h-4 text-purple-500" />
        <span className="text-xs text-gray-400">
          {new Date(notice.created_at).toLocaleDateString()}
        </span>
        {notice.telegram_sent && (
          <span className="text-xs bg-green-100 dark:bg-green-900/20 text-green-600 px-2 py-0.5 rounded-full flex items-center gap-1">
            <Send className="w-3 h-3" /> Sent to Telegram
          </span>
        )}
      </div>

      {notice.event_date && (
        <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
          <Calendar className="w-3 h-3" />
          Event: {new Date(notice.event_date).toLocaleDateString()}
        </div>
      )}

      {notice.summary && (
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3">
          <p className="text-xs font-medium text-purple-700 dark:text-purple-300 mb-1">
            AI Summary
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">
            {notice.summary}
          </p>
        </div>
      )}

      <details className="mt-3">
        <summary className="text-xs text-gray-400 cursor-pointer hover:text-gray-600">
          View original notice
        </summary>
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 line-clamp-5">
          {notice.original_text}
        </p>
      </details>
    </div>
  )
}