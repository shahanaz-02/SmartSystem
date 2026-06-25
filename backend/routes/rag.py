from fastapi import APIRouter, Depends, UploadFile, File
from sqlalchemy.orm import Session
from database import get_db
from schemas import QuestionRequest, TextUpload
from models import Student
from routes.tasks import get_current_student
from services.webhook import trigger_rag_answer
import sys, os, shutil, uuid

# Point to ai-rag folder
sys.path.append(os.path.join(os.path.dirname(__file__), "../../ai-rag"))

router = APIRouter(prefix="/api/rag", tags=["RAG"])


def get_rag():
    try:
        from rag_engine import ask, add_text
        from pdf_loader import load_pdf
        return ask, add_text, load_pdf
    except ImportError:
        return None, None, None


@router.post("/ask")
async def ask_question(data: QuestionRequest,
                       student: Student = Depends(get_current_student)):
    ask, _, _ = get_rag()
    if not ask:
        return {"error": "RAG engine not available yet"}

    answer = ask(data.question)

    if data.send_to_telegram and student.telegram_chat_id:
        await trigger_rag_answer(
            chat_id=student.telegram_chat_id,
            question=data.question,
            answer=answer
        )
    return {"question": data.question, "answer": answer}


@router.post("/upload/text")
async def upload_text(data: TextUpload,
                      student: Student = Depends(get_current_student)):
    _, add_text, _ = get_rag()
    if not add_text:
        return {"error": "RAG engine not available yet"}

    add_text(data.text, {"source": data.source, "student_id": str(student.id)})
    return {"message": "Text added to knowledge base ✅"}


@router.post("/upload/pdf")
async def upload_pdf(file: UploadFile = File(...),
                     student: Student = Depends(get_current_student)):
    _, _, load_pdf = get_rag()
    if not load_pdf:
        return {"error": "RAG engine not available yet"}

    temp_path = f"/tmp/{uuid.uuid4()}_{file.filename}"
    with open(temp_path, "wb") as f:
        shutil.copyfileobj(file.file, f)

    chunks = load_pdf(temp_path, {"source": file.filename,
                                   "student_id": str(student.id)})
    os.remove(temp_path)
    return {"message": f"PDF loaded ✅ {chunks} chunks added to knowledge base"}