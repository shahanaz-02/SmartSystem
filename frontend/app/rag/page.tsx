"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/Navbar"
import { api } from "@/lib/api"
import { Brain, Upload, Send } from "lucide-react"

export default function RAGPage() {
  const router = useRouter()
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")
  const [loading, setLoading] = useState(false)
  const [text, setText] = useState("")
  const [uploadMsg, setUploadMsg] = useState("")
  const [sendTelegram, setSendTelegram] = useState(false)
  const [tab, setTab] = useState<"ask"|"upload">("ask")

  useEffect(() => {
    if (!localStorage.getItem("token")) router.push("/login")
  }, [])

  const ask = async () => {
    if (!question.trim()) return
    setLoading(true)
    setAnswer("")
    const res = await api.askQuestion({
      question, send_to_telegram: sendTelegram
    })
    setAnswer(res.answer || res.error || "No answer found")
    setLoading(false)
  }

  const uploadText = async () => {
    if (!text.trim()) return
    const res = await api.uploadText({ text, source: "manual" })
    setUploadMsg(res.message || "Uploaded!")
    setText("")
  }

  const uploadPDF = async (e: any) => {
    const file = e.target.files[0]
    if (!file) return
    const res = await api.uploadPDF(file)
    setUploadMsg(res.message || "PDF uploaded!")
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <main className="max-w-3xl mx-auto px-6 py-8">
        <div className="flex items-center gap-2 mb-6">
          <Brain className="w-6 h-6 text-indigo-500" />
          <h1 className="text-2xl font-bold dark:text-white">Ask AI (RAG)</h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {(["ask", "upload"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-xl text-sm font-medium transition-colors ${
                tab === t
                  ? "bg-indigo-600 text-white"
                  : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100"
              }`}>
              {t === "ask" ? "Ask a Question" : "Upload Material"}
            </button>
          ))}
        </div>

        {tab === "ask" ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <p className="text-sm text-gray-500 mb-4">
              Ask anything from your uploaded notes or college notices.
            </p>
            <textarea
              placeholder="e.g. When is the DBMS exam? Explain Round Robin scheduling..."
              value={question} onChange={e => setQuestion(e.target.value)}
              rows={3}
              className="w-full border dark:border-gray-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white resize-none mb-3"
            />
            <label className="flex items-center gap-2 text-sm dark:text-gray-300 mb-4">
              <input type="checkbox"
                checked={sendTelegram}
                onChange={e => setSendTelegram(e.target.checked)}
              />
              Send answer to Telegram
            </label>
            <button onClick={ask} disabled={loading}
              className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50">
              <Send className="w-4 h-4" />
              {loading ? "Thinking..." : "Ask AI"}
            </button>

            {answer && (
              <div className="mt-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-4">
                <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400 mb-2">
                  🤖 AI Answer
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">
                  {answer}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm space-y-6">
            {/* Text Upload */}
            <div>
              <h3 className="font-medium dark:text-white mb-3">Paste Text / Notes</h3>
              <textarea
                placeholder="Paste your study notes or college notice here..."
                value={text} onChange={e => setText(e.target.value)}
                rows={5}
                className="w-full border dark:border-gray-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white resize-none mb-3"
              />
              <button onClick={uploadText}
                className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors">
                <Upload className="w-4 h-4" /> Upload Text
              </button>
            </div>

            {/* PDF Upload */}
            <div>
              <h3 className="font-medium dark:text-white mb-3">Upload PDF</h3>
              <label className="flex items-center gap-3 cursor-pointer border-2 border-dashed dark:border-gray-600 rounded-xl p-6 hover:border-indigo-400 transition-colors">
                <Upload className="w-8 h-8 text-indigo-400" />
                <div>
                  <p className="text-sm font-medium dark:text-white">Click to upload PDF</p>
                  <p className="text-xs text-gray-400">Study notes, question papers, notices</p>
                </div>
                <input type="file" accept=".pdf" className="hidden" onChange={uploadPDF} />
              </label>
            </div>

            {uploadMsg && (
              <div className="bg-green-50 dark:bg-green-900/20 text-green-600 text-sm p-3 rounded-lg">
                ✅ {uploadMsg}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}