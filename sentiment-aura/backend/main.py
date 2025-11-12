from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from dotenv import load_dotenv
import httpx
import json

load_dotenv()

app = FastAPI()

# Enable CORS so frontend can talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TranscriptRequest(BaseModel):
    text: str

class SentimentResponse(BaseModel):
    sentiment: float
    keywords: list[str]
    emotion: str

@app.post("/process_text", response_model=SentimentResponse)
async def process_text(request: TranscriptRequest):
    """
    Receives text from frontend, sends to LLM for analysis,
    returns structured sentiment data
    """
    try:
        api_key = os.getenv("GROQ_API_KEY")
        
        if not api_key:
            raise HTTPException(status_code=500, detail="API key not configured")
        
        prompt = f"""Analyze the sentiment and extract keywords from this text: "{request.text}"

Return ONLY a valid JSON object with this exact structure (no markdown, no explanations):
{{
  "sentiment": <number between -1 and 1, where -1 is very negative, 0 is neutral, 1 is very positive>,
  "emotion": "<one word: happy, sad, angry, excited, calm, anxious, or neutral>",
  "keywords": ["<keyword1>", "<keyword2>", "<keyword3>"]
}}"""

        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://api.groq.com/openai/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {api_key}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": "llama-3.1-8b-instant",
                    "messages": [{"role": "user", "content": prompt}],
                    "temperature": 0.3,
                    "max_tokens": 150
                },
                timeout=10.0
            )
            
        if response.status_code != 200:
            print(f"Groq API error: {response.text}")
            raise HTTPException(status_code=500, detail="LLM API error")
            
        result = response.json()
        content = result["choices"][0]["message"]["content"].strip()
        
        # Parse JSON from LLM response
        if "```json" in content:
            content = content.split("```json")[1].split("```")[0].strip()
        elif "```" in content:
            content = content.split("```")[1].split("```")[0].strip()
            
        data = json.loads(content)
        
        return SentimentResponse(
            sentiment=float(data["sentiment"]),
            keywords=data["keywords"][:5],
            emotion=data["emotion"]
        )
        
    except Exception as e:
        print(f"Error: {e}")
        return SentimentResponse(
            sentiment=0.0,
            keywords=["processing"],
            emotion="neutral"
        )

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)