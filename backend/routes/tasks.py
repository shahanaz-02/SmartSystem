from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Task, Student
from schemas import TaskCreate, TaskOut
from services.ai import generate_study_plan
from services.webhook import trigger_task_reminder
from jose import jwt, JWTError
from fastapi.security import OAuth2PasswordBearer
from datetime import datetime
import os

router = APIRouter(prefix="/api/tasks", tags=["Tasks"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/students/login")
JWT_SECRET = os.getenv("JWT_SECRET", "fallback_secret")


def get_current_student(token: str = Depends(oauth2_scheme),
                         db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        student = db.query(Student).filter(
            Student.id == int(payload["sub"])).first()
        if not student:
            raise HTTPException(status_code=401, detail="Student not found")
        return student
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")


@router.post("/", response_model=TaskOut)
async def create_task(data: TaskCreate,
                       student: Student = Depends(get_current_student),
                       db: Session = Depends(get_db)):
    study_plan = generate_study_plan(
        data.title, data.subject, str(data.deadline.date())
    )
    task = Task(
        student_id=student.id,
        title=data.title,
        subject=data.subject,
        deadline=data.deadline,
        reminder_time=data.reminder_time,
        add_to_calendar=data.add_to_calendar,
        ai_study_plan=study_plan
    )
    db.add(task)
    db.commit()
    db.refresh(task)

    await trigger_task_reminder(
        student_name=student.name,
        chat_id=student.telegram_chat_id,
        subject=data.subject,
        title=data.title,
        deadline=str(data.deadline.date())
    )
    return task


@router.get("/", response_model=list[TaskOut])
def get_tasks(student: Student = Depends(get_current_student),
              db: Session = Depends(get_db)):
    return db.query(Task).filter(Task.student_id == student.id).all()


@router.put("/{task_id}/complete", response_model=TaskOut)
def complete_task(task_id: int,
                  student: Student = Depends(get_current_student),
                  db: Session = Depends(get_db)):
    task = db.query(Task).filter(
        Task.id == task_id, Task.student_id == student.id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    task.is_completed = True
    db.commit()
    db.refresh(task)
    return task


@router.delete("/{task_id}")
def delete_task(task_id: int,
                student: Student = Depends(get_current_student),
                db: Session = Depends(get_db)):
    task = db.query(Task).filter(
        Task.id == task_id, Task.student_id == student.id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    db.delete(task)
    db.commit()
    return {"message": "Task deleted successfully"}