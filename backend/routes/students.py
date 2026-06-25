from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Student
from schemas import StudentCreate, StudentOut, LoginRequest, TokenOut
from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta
import os

router = APIRouter(prefix="/api/students", tags=["Students"])
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
JWT_SECRET = os.getenv("JWT_SECRET", "fallback_secret")


def create_token(student_id: int):
    payload = {
        "sub": str(student_id),
        "exp": datetime.utcnow() + timedelta(days=7)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256")


@router.post("/register", response_model=TokenOut)
def register(data: StudentCreate, db: Session = Depends(get_db)):
    existing = db.query(Student).filter(Student.email == data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    student = Student(
        name=data.name,
        email=data.email,
        password_hash=pwd_context.hash(data.password),
        branch=data.branch,
        year=data.year,
        phone=data.phone,
        telegram_chat_id=data.telegram_chat_id,
        google_account=data.google_account
    )
    db.add(student)
    db.commit()
    db.refresh(student)
    return {"access_token": create_token(student.id),
            "token_type": "bearer", "student": student}


@router.post("/login", response_model=TokenOut)
def login(data: LoginRequest, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.email == data.email).first()
    if not student or not pwd_context.verify(data.password, student.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"access_token": create_token(student.id),
            "token_type": "bearer", "student": student}