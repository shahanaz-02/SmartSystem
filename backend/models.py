from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class Student(Base):
    __tablename__ = "students"

    id               = Column(Integer, primary_key=True, index=True)
    name             = Column(String, nullable=False)
    email            = Column(String, unique=True, index=True, nullable=False)
    password_hash    = Column(String, nullable=False)
    branch           = Column(String)
    year             = Column(String)
    phone            = Column(String)
    telegram_chat_id = Column(String)
    google_account   = Column(String)
    created_at       = Column(DateTime, default=datetime.utcnow)

    tasks   = relationship("Task", back_populates="student")
    notices = relationship("Notice", back_populates="student")


class Task(Base):
    __tablename__ = "tasks"

    id              = Column(Integer, primary_key=True, index=True)
    student_id      = Column(Integer, ForeignKey("students.id"))
    title           = Column(String, nullable=False)
    subject         = Column(String)
    deadline        = Column(DateTime, nullable=False)
    reminder_time   = Column(DateTime)
    add_to_calendar = Column(Boolean, default=True)
    is_completed    = Column(Boolean, default=False)
    ai_study_plan   = Column(Text)
    created_at      = Column(DateTime, default=datetime.utcnow)

    student = relationship("Student", back_populates="tasks")


class Notice(Base):
    __tablename__ = "notices"

    id               = Column(Integer, primary_key=True, index=True)
    student_id       = Column(Integer, ForeignKey("students.id"))
    original_text    = Column(Text, nullable=False)
    summary          = Column(Text)
    event_date       = Column(DateTime)
    calendar_created = Column(Boolean, default=False)
    telegram_sent    = Column(Boolean, default=False)
    created_at       = Column(DateTime, default=datetime.utcnow)

    student = relationship("Student", back_populates="notices")