import os
import asyncio
import threading
from fastapi import FastAPI
import uvicorn
from telegram import Update
from telegram.ext import Application, CommandHandler, MessageHandler, filters, ContextTypes
from google import genai

# 1. Environment Variables Set Karna
TELEGRAM_TOKEN = os.getenv("TELEGRAM_TOKEN", "YAHAN_TERA_TELEGRAM_TOKEN_AAYEGA")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "YAHAN_TERA_GEMINI_KEY_AAYEGA")

# 2. Web Server Setup (For 24/7 Render & Cron-job Ping)
app = FastAPI()

@app.get("/")
def home():
    return {"status": "Hermes Content Factory is ONLINE 24/7"}

@app.get("/ping")
def ping():
    return {"ping": "pong - System is awake"}

# 3. Telegram Bot & AI Logic Setup
async def start_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text("🚀 Hermes Factory Online! Send me a topic to research.")

async def handle_message(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user_text = update.message.text
    await update.message.reply_text(f"⏳ Processing mission: {user_text}...")
    
    try:
        client = genai.Client(api_key=GEMINI_API_KEY)
        # Yeh basic prototype call hai, aage isme multi-agents jodenge
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=f"Act as a YouTube Content Researcher. Give 3 viral video angles for: {user_text}",
        )
        await update.message.reply_text(response.text)
    except Exception as e:
        await update.message.reply_text(f"❌ Error in AI Engine: {str(e)}")

def run_telegram_bot():
    """Bot ko background mein run karne ka function"""
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    
    application = Application.builder().token(TELEGRAM_TOKEN).build()
    application.add_handler(CommandHandler("start", start_command))
    application.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_message))
    
    application.run_polling(drop_pending_updates=True)

# 4. Engine Boot Sequence
if __name__ == "__main__":
    # Telegram bot ko alag thread mein start karna taaki Web Server block na ho
    bot_thread = threading.Thread(target=run_telegram_bot, daemon=True)
    bot_thread.start()
    
    # Web server start karna (Render ke liye)
    uvicorn.run(app, host="0.0.0.0", port=10000)
