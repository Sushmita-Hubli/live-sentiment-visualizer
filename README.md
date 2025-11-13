# Sentiment Aura

Real-time AI-powered sentiment analysis with live audio transcription and generative Perlin noise visualization.

## Demo Video

**[Watch Demo Video](https://drive.google.com/file/d/1oun988wck9FSD_ra3gIOhD8X3HfTjFUO/view?usp=drive_link)**

## Features

- Real-time audio transcription using Deepgram WebSocket API
- AI sentiment analysis using Groq (Llama 3.1 8B)
- Dynamic Perlin noise visualization that responds to emotions
- Smooth keyword animations
- End-to-end latency under 2 seconds

## Tech Stack

**Frontend:** React, p5.js, Deepgram SDK, Axios

**Backend:** FastAPI, Groq API, HTTPX, Uvicorn

## How It Works

1. User speaks into microphone
2. Audio streams to Deepgram for real-time transcription
3. Transcript sent to FastAPI backend
4. Backend analyzes sentiment using Groq's Llama 3.1 model
5. Frontend receives sentiment data and updates visualization
6. Visualization responds with colors and movement based on emotion

## Sentiment Visualization

- **Positive emotions** (happy, excited): Warm colors (yellow/orange), fast movement
- **Negative emotions** (sad, angry): Cool colors (blue), slow movement
- **Neutral emotions**: Purple/magenta colors, moderate movement

## Setup Instructions

### Prerequisites

- Node.js (v18+)
- Python (v3.8+)
- Deepgram API key (free $200 credits at console.deepgram.com)
- Groq API key (free at console.groq.com)

### Backend Setup
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Mac/Linux
pip install fastapi uvicorn python-dotenv openai httpx
```

Create `.env` file in backend folder:
```
GROQ_API_KEY=your_groq_api_key_here
```

Run backend:
```bash
python main.py
```

Backend runs on http://localhost:8000

### Frontend Setup

Open new terminal window:
```bash
cd frontend
npm install
```

Create `.env` file in frontend folder:
```
REACT_APP_DEEPGRAM_API_KEY=your_deepgram_api_key_here
```

Run frontend:
```bash
npm start
```

Frontend runs on http://localhost:3000

## Usage

1. Open http://localhost:3000
2. Click "Start Recording"
3. Allow microphone access
4. Speak into microphone
5. Watch live transcript, keywords, and visualization respond to your emotions

## Project Structure
```
sentiment-aura/
├── backend/
│   ├── main.py
│   ├── .env.example
│   └── venv/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AuraVisualization.js
│   │   │   ├── TranscriptDisplay.js
│   │   │   ├── KeywordsDisplay.js
│   │   │   └── Controls.js
│   │   ├── App.js
│   │   └── App.css
│   ├── .env.example
│   └── package.json
├── .gitignore
└── README.md
```

## Author

Sushmita Hubli

Built for Memory Machines Co-Op Application
