# 🤖 CampusFlow Automation (n8n)

This folder contains automation workflows used in the CampusFlow project.

---

## 📦 What is inside?

### 1. task.json
- Triggered when a new task is created
- Sends Telegram reminder to student
- Used for deadline alerts

---

### 2. notice.json
- Triggered when a notice is added
- Summarizes notice content
- Sends summary to Telegram

---

## ⚙️ How it works (FLOW)

Backend (FastAPI)
→ sends webhook request
→ n8n workflow triggers
→ Telegram message sent to student

---

## 🚀 Setup Steps

### Step 1: Open n8n
http://localhost:5678

### Step 2: Import workflows
- task.json
- notice.json

### Step 3: Add credentials
- Telegram Bot Token (from BotFather)
- Chat ID (from @userinfobot)

### Step 4: Activate workflows
Turn ON both workflows

---

## 🔑 Required Secrets

- Telegram Bot Token
- Telegram Chat ID
- Webhook URLs from n8n

---

## 🎯 Purpose

This automation helps:
- send deadline reminders
- send notice summaries
- reduce manual notifications

---

## 🏁 Status

✔ Task automation ready  
✔ Notice automation ready  
⚙ Telegram connection pending setup in n8n