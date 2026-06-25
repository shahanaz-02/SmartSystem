import httpx
import os
from dotenv import load_dotenv

load_dotenv()

TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
TELEGRAM_API = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}"


async def send_telegram(chat_id: str, message: str):
    async with httpx.AsyncClient() as client:
        try:
            await client.post(
                f"{TELEGRAM_API}/sendMessage",
                json={
                    "chat_id": chat_id,
                    "text": message,
                    "parse_mode": "Markdown"
                },
                timeout=10
            )
        except Exception as e:
            print(f"Telegram error: {e}")


async def trigger_task_reminder(student_name: str, chat_id: str,
                                 subject: str, title: str, deadline: str):
    message = (
        f"⏰ *CampusFlow Reminder*\n\n"
        f"Hi *{student_name}*\\!\n"
        f"Your *{subject}* task *{title}* is due on `{deadline}`\n\n"
        f"📅 Check your Google Calendar\\!\n"
        f"_— CampusFlow_"
    )
    await send_telegram(chat_id, message)


async def trigger_notice_summary(student_name: str, chat_id: str,
                                  summary: str, event_date: str):
    message = (
        f"📋 *CampusFlow Notice*\n\n"
        f"Hi *{student_name}*\\!\n\n"
        f"{summary}\n\n"
        f"📅 Event Date: `{event_date}`\n"
        f"_— CampusFlow_"
    )
    await send_telegram(chat_id, message)


async def trigger_rag_answer(chat_id: str, question: str, answer: str):
    message = (
        f"🤖 *CampusFlow AI Answer*\n\n"
        f"*Q: {question}*\n\n"
        f"{answer}\n\n"
        f"_— CampusFlow RAG_"
    )
    await send_telegram(chat_id, message)