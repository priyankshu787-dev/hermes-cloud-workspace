import os
import importlib
import pkgutil
from fastapi import FastAPI, Request
import uvicorn
from telegram import Update
from telegram.ext import Application, CommandHandler, ContextTypes

import agents  # agents folder ko dynamically import kiya

TELEGRAM_TOKEN = os.getenv("TELEGRAM_TOKEN", "")

app = FastAPI()
application = Application.builder().token(TELEGRAM_TOKEN).build()

# --- DYNAMIC LOADER LOOP ---
# Yeh loop 'agents/' folder ki saari files ko khud-b-khud padh kar command register kar leta hai
for _, module_name, _ in pkgutil.iter_modules(agents.__path__):
    module = importlib.import_module(f"agents.{module_name}")
    if hasattr(module, "COMMAND") and hasattr(module, "handle"):
        application.add_handler(CommandHandler(module.COMMAND, module.handle))
        print(f"Loaded Dynamic Agent: /{module.COMMAND}")

async def start_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    welcome_text = (
        "🚀 **Hermes AI Content Factory (Dynamic Mode) Online!**\n\n"
        "1️⃣ `/topic [niche]` - Viral YouTube video topics.\n"
        "2️⃣ `/script [topic]` - Full video script generator."
    )
    await update.message.reply_text(welcome_text, parse_mode="Markdown")

application.add_handler(CommandHandler("start", start_command))

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
    return {"status": "Dynamic Content Factory is LIVE"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=10000)