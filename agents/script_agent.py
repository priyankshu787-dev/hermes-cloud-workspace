import os
from google import genai

COMMAND = "script"  # Telegram command

async def handle(update, context):
    user_text = " ".join(context.args)
    if not user_text:
        await update.message.reply_text("⚠️ Provide a title! Example: `/script How AI Works`", parse_mode="Markdown")
        return
    
    await update.message.reply_text(f"✍️ Drafting script for: '{user_text}'...")
    try:
        client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
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