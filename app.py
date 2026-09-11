import os
from fastapi import FastAPI
from fastapi.responses import HTMLResponse
import uvicorn
from google import genai

app = FastAPI()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=GEMINI_API_KEY) if GEMINI_API_KEY else None

@app.get("/", response_class=HTMLResponse)
def home():
    return """
    <!DOCTYPE html>
    <html>
    <head>
        <title>Hermes Official Workspace</title>
        <style>
            body { background: #050505; color: #00ffcc; font-family: monospace; padding: 40px; }
            .box { border: 1px solid #00ffcc; padding: 20px; border-radius: 5px; background: #111; }
        </style>
    </head>
    <body>
        <div class="box">
            <h1>🛡️ Hermes Docker Container Online</h1>
            <p>Status: Fully operational on Cloud Docker Environment.</p>
            <p>Ready to receive multi-agent orchestration tasks.</p>
        </div>
    </body>
    </html>
    """

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=10000)
