from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import Task, Notice, Student
from routes.tasks import get_current_student
from datetime import datetime

router = APIRouter(prefix="/api/analytics", tags=["Analytics"])


@router.get("/")
def get_analytics(student: Student = Depends(get_current_student),
                  db: Session = Depends(get_db)):
    tasks   = db.query(Task).filter(Task.student_id == student.id).all()
    notices = db.query(Notice).filter(Notice.student_id == student.id).all()

    completed = [t for t in tasks if t.is_completed]
    pending   = [t for t in tasks if not t.is_completed]
    overdue   = [t for t in pending if t.deadline < datetime.utcnow()]

    subjects = {}
    for task in tasks:
        subjects[task.subject] = subjects.get(task.subject, 0) + 1

    return {
        "total_tasks":       len(tasks),
        "completed_tasks":   len(completed),
        "pending_tasks":     len(pending),
        "overdue_tasks":     len(overdue),
        "total_notices":     len(notices),
        "completion_rate":   round(len(completed) / len(tasks) * 100, 1) if tasks else 0,
        "tasks_by_subject":  subjects
    }