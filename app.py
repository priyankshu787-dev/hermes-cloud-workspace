import os
from fastapi import FastAPI, Request
import uvicorn
from telegram import Update
from telegram.ext import Application, CommandHandler, MessageHandler, filters, ContextTypes
from google import genai

TELEGRAM_TOKEN = os.getenv("TELEGRAM_TOKEN", "")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

app = FastAPI()
application = Application.builder().token(TELEGRAM_TOKEN).build()

# --- START COMMAND ---
async def start_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    welcome_text = (
        "🚀 **Hermes AI Content Factory Online!**\n\n"
        "Yahan teri 2 superpowers hain:\n"
        "1️⃣ `/topic [niche]` - Viral YouTube video topics dhoondne ke liye.\n"
        "2️⃣ `/script [topic]` - Us topic par poori video script likhne ke liye."
    )
    await update.message.reply_text(welcome_text, parse_mode="Markdown")

# --- DEMO PROJECT 1: TOPIC FINDER AGENT ---
async def topic_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user_text = " ".join(context.args)
    if not user_text:
        await update.message.reply_text("⚠️ Please provide a topic! Example: `/topic AI Automation`", parse_mode="Markdown")
        return

    await update.message.reply_text(f"🔍 [Topic Finder] Analyzing market trends for: '{user_text}'...")
    try:
        client = genai.Client(api_key=GEMINI_API_KEY)
        prompt = f"""
        You are an expert YouTube Content Strategist. Analyze the niche: '{user_text}'.
        Provide 3 highly clickable, viral YouTube video angles with:
        1. Catchy Title
        2. Core Psychological Hook
        3. Brief storyline
        """
        response = client.models.generate_content(model='gemini-2.5-flash', contents=prompt)
        await update.message.reply_text(response.text)
    except Exception as e:
        await update.message.reply_text(f"❌ Error in Topic Finder: {str(e)}")

# --- DEMO PROJECT 2: SCRIPT WRITER AGENT ---
async def script_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user_text = " ".join(context.args)
    if not user_text:
        await update.message.reply_text("⚠️ Please provide a title! Example: `/script How AI Will Replace Jobs`", parse_mode="Markdown")
        return

    await update.message.reply_text(f"✍️ [Script Writer] Drafting high-retention script for: '{user_text}'...")
    try:
        client = genai.Client(api_key=GEMINI_API_KEY)
        prompt = f"""
        You are a master YouTube Scriptwriter for documentary channels.
        Write a short, engaging YouTube video script for the title: '{user_text}'.
        Include:
        - Hook (First 5 seconds)
        - Body Explanation (Engaging narrative)
        - Outro / Call to Action
        """
        response = client.models.generate_content(model='gemini-2.5-flash', contents=prompt)
        await update.message.reply_text(response.text)
    except Exception as e:
        await update.message.reply_text(f"❌ Error in Script Writer: {str(e)}")

# Handlers register karna
application.add_handler(CommandHandler("start", start_command))
application.add_handler(CommandHandler("topic", topic_command))
application.add_handler(CommandHandler("script", script_command))

@app.on_event("startup")
async def startup_event():
    await application.initialize()

@app.post("/webhook")
async def telegram_webhook(request: Request):
    data = await request.json()
    update = Update.de_json(data, application.bot)
    await application.process_update(update)
    return {"status": "ok"}

@app.get("/")
def home():
    return {"status": "Content Factory with Topic Finder & Script Writer is LIVE"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=10000)
