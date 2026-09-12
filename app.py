import os
import asyncio
from fastapi import FastAPI
import uvicorn
from telegram import Update
from telegram.ext import Application, CommandHandler, MessageHandler, filters, ContextTypes
from google import genai

TELEGRAM_TOKEN = os.getenv("TELEGRAM_TOKEN", "MISSING_TOKEN")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "MISSING_KEY")

app = FastAPI()
application = Application.builder().token(TELEGRAM_TOKEN).build()

async def start_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text("🚀 Hermes Factory Online! Send me a topic to research.")

async def handle_message(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user_text = update.message.text
    await update.message.reply_text(f"⏳ Processing mission: {user_text}...")
    try:
        client = genai.Client(api_key=GEMINI_API_KEY)
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=f"Act as a YouTube Content Researcher. Give 3 viral video angles for: {user_text}",
        )
        await update.message.reply_text(response.text)
    except Exception as e:
        await update.message.reply_text(f"❌ Error in AI Engine: {str(e)}")

application.add_handler(CommandHandler("start", start_command))
application.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_message))

# Dono ko ek sath (bina crash ke) start karne ka logic
@app.on_event("startup")
async def startup_event():
    await application.initialize()
    await application.start()
    await application.updater.start_polling(drop_pending_updates=True)

@app.on_event("shutdown")
async def shutdown_event():
    await application.updater.stop()
    await application.stop()
    await application.shutdown()

@app.get("/")
def home():
    return {"status": "Hermes Content Factory is ONLINE 24/7"}

@app.get("/ping")
def ping():
    return {"ping": "pong - System is awake"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=10000)
