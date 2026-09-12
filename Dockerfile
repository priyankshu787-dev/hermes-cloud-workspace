FROM python:3.11-slim

WORKDIR /app

# Copy requirements file first
COPY requirements.txt .

# Install all the libraries mentioned in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the code
COPY . .

EXPOSE 10000

# Start the bot and web server
CMD ["python", "app.py"]
