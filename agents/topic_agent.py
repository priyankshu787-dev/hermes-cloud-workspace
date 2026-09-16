import os
from google import genai

COMMAND = "topic"  # Telegram command

async def handle(update, context):
    user_text = " ".join(context.args)
    if not user_text:
        await update.message.reply_text("⚠️ Provide a topic! Example: `/topic AI`", parse_mode="Markdown")
        return
    
    await update.message.reply_text(f"🔍 Analyzing market trends for: '{user_text}'...")
    try:
        client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
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