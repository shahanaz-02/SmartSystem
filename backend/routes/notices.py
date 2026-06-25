from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import Notice, Student
from schemas import NoticeCreate, NoticeOut
from services.ai import summarize_notice
from services.webhook import trigger_notice_summary
from routes.tasks import get_current_student

router = APIRouter(prefix="/api/notices", tags=["Notices"])


@router.post("/", response_model=NoticeOut)
async def create_notice(data: NoticeCreate,
                         student: Student = Depends(get_current_student),
                         db: Session = Depends(get_db)):
    summary = summarize_notice(data.original_text)

    notice = Notice(
        student_id=student.id,
        original_text=data.original_text,
        summary=summary,
        event_date=data.event_date,
        telegram_sent=True
    )
    db.add(notice)
    db.commit()
    db.refresh(notice)

    await trigger_notice_summary(
        student_name=student.name,
        chat_id=student.telegram_chat_id,
        summary=summary,
        event_date=str(data.event_date.date()) if data.event_date else "Not specified"
    )
    return notice


@router.get("/", response_model=list[NoticeOut])
def get_notices(student: Student = Depends(get_current_student),
                db: Session = Depends(get_db)):
    return db.query(Notice).filter(Notice.student_id == student.id).all()