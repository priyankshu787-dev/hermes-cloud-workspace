FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y git curl build-essential && rm -rf /var/lib/apt/lists/*

# Install essential python packages for agent workspace
RUN pip install --no-cache-dir fastapi uvicorn google-genai requests pydantic

# Copy local files
COPY . .

# Expose port for Render
EXPOSE 10000

# Start command for container
CMD ["python", "app.py"]
