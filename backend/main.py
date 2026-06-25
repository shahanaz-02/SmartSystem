from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routes import students, tasks, notices, analytics, rag

# Create all DB tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="CampusFlow API",
    description="Smart Student Productivity Platform",
    version="1.0.0"
)

# Allow frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000","https://smart-system-zeta.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register all routes
app.include_router(students.router)
app.include_router(tasks.router)
app.include_router(notices.router)
app.include_router(analytics.router)
app.include_router(rag.router)

@app.get("/")
def root():
    return {
        "message": "CampusFlow API running 🚀",
        "docs": "http://localhost:8000/docs"
    }