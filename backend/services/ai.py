from groq import Groq
from dotenv import load_dotenv
import os

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def generate_study_plan(title: str, subject: str, deadline: str) -> str:
    prompt = f"""
    You are a student productivity assistant for Indian engineering students.
    Task: "{title}" | Subject: "{subject}" | Due: {deadline}

    Create a practical day-by-day study plan to finish this on time.
    Format as:
    Day 1: ...
    Day 2: ...
    Keep it motivating and specific. Max 8 days.
    """
    response = client.chat.completions.create(
        model="llama3-70b-8192",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=600
    )
    return response.choices[0].message.content


def summarize_notice(notice_text: str) -> str:
    prompt = f"""
    You are a college notice summarizer for Indian engineering students.
    Summarize the following notice into EXACTLY 3 bullet points.
    Each bullet = one clear sentence mentioning dates, deadlines, actions.
    Start each bullet with •

    Notice:
    {notice_text}

    Respond with only 3 bullet points. Nothing else.
    """
    response = client.chat.completions.create(
        model="llama3-70b-8192",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=300
    )
    return response.choices[0].message.content