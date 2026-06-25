"use client"
import { useState } from "react"
import { Mic, MicOff } from "lucide-react"

interface VoiceInputProps {
  onResult: (text: string) => void
}

export default function VoiceInput({ onResult }: VoiceInputProps) {
  const [listening, setListening] = useState(false)

  const startListening = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition

    if (!SpeechRecognition) {
      alert("Voice input not supported in this browser. Use Chrome or Edge.")
      return
    }

    const recognition = new SpeechRecognition()
    recognition.lang = "en-IN"
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    recognition.onstart = () => setListening(true)
    recognition.onend = () => setListening(false)
    recognition.onresult = (e: any) => {
      const text = e.results[0][0].transcript
      onResult(text)
    }
    recognition.onerror = () => setListening(false)
    recognition.start()
  }

  return (
    <button
      type="button"
      onClick={startListening}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
        listening
          ? "bg-red-500 text-white animate-pulse"
          : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200"
      }`}
    >
      {listening ? (
        <><MicOff className="w-4 h-4" /> Listening...</>
      ) : (
        <><Mic className="w-4 h-4" /> Speak Task Title</>
      )}
    </button>
  )
}