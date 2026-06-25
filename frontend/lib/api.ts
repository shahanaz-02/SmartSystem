const BASE_URL = "http://localhost:8000/api"

const getToken = () => localStorage.getItem("token") || ""

export const api = {
  // ── Auth ──────────────────────────────────────
  register: (data: any) =>
    fetch(`${BASE_URL}/students/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    }).then(r => r.json()),

  login: (data: any) =>
    fetch(`${BASE_URL}/students/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    }).then(r => r.json()),

  // ── Tasks ─────────────────────────────────────
  getTasks: () =>
    fetch(`${BASE_URL}/tasks`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    }).then(r => r.json()),

  createTask: (data: any) =>
    fetch(`${BASE_URL}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`
      },
      body: JSON.stringify(data)
    }).then(r => r.json()),

  completeTask: (id: number) =>
    fetch(`${BASE_URL}/tasks/${id}/complete`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${getToken()}` }
    }).then(r => r.json()),

  deleteTask: (id: number) =>
    fetch(`${BASE_URL}/tasks/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${getToken()}` }
    }).then(r => r.json()),

  // ── Notices ───────────────────────────────────
  getNotices: () =>
    fetch(`${BASE_URL}/notices`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    }).then(r => r.json()),

  createNotice: (data: any) =>
    fetch(`${BASE_URL}/notices`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`
      },
      body: JSON.stringify(data)
    }).then(r => r.json()),

  // ── Analytics ─────────────────────────────────
  getAnalytics: () =>
    fetch(`${BASE_URL}/analytics`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    }).then(r => r.json()),

  // ── RAG ───────────────────────────────────────
  askQuestion: (data: any) =>
    fetch(`${BASE_URL}/rag/ask`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`
      },
      body: JSON.stringify(data)
    }).then(r => r.json()),

  uploadText: (data: any) =>
    fetch(`${BASE_URL}/rag/upload/text`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`
      },
      body: JSON.stringify(data)
    }).then(r => r.json()),

  uploadPDF: (file: File) => {
    const form = new FormData()
    form.append("file", file)
    return fetch(`${BASE_URL}/rag/upload/pdf`, {
      method: "POST",
      headers: { Authorization: `Bearer ${getToken()}` },
      body: form
    }).then(r => r.json())
  }
}