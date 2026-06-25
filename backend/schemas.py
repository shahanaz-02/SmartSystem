from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

# ── Student ──────────────────────────────
class StudentCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    branch: str
    year: str
    phone: str
    telegram_chat_id: str
    google_account: str

class StudentOut(BaseModel):
    id: int
    name: str
    email: str
    branch: str
    year: str
    phone: str
    telegram_chat_id: str
    created_at: datetime

    class Config:
        from_attributes = True

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenOut(BaseModel):
    access_token: str
    token_type: str
    student: StudentOut

# ── Task ─────────────────────────────────
class TaskCreate(BaseModel):
    title: str
    subject: str
    deadline: datetime
    reminder_time: Optional[datetime] = None
    add_to_calendar: bool = True

class TaskOut(BaseModel):
    id: int
    title: str
    subject: str
    deadline: datetime
    reminder_time: Optional[datetime]
    add_to_calendar: bool
    is_completed: bool
    ai_study_plan: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True

# ── Notice ───────────────────────────────
class NoticeCreate(BaseModel):
    original_text: str
    event_date: Optional[datetime] = None

class NoticeOut(BaseModel):
    id: int
    original_text: str
    summary: Optional[str]
    event_date: Optional[datetime]
    calendar_created: bool
    telegram_sent: bool
    created_at: datetime

    class Config:
        from_attributes = True

# ── Analytics ────────────────────────────
class AnalyticsOut(BaseModel):
    total_tasks: int
    completed_tasks: int
    pending_tasks: int
    overdue_tasks: int
    total_notices: int
    completion_rate: float
    tasks_by_subject: dict

# ── RAG ──────────────────────────────────
class QuestionRequest(BaseModel):
    question: str
    send_to_telegram: bool = False

class TextUpload(BaseModel):
    text: str
    source: str = "manual"