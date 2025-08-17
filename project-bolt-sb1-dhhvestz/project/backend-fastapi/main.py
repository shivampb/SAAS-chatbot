from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import google.generativeai as genai
import os
from dotenv import load_dotenv
import uvicorn

load_dotenv()

app = FastAPI()

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure Gemini AI
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel('gemini-pro')

class ChatRequest(BaseModel):
    message: str
    conversationId: str
    config: dict = {}

conversations = {}

@app.post("/api/chat")
async def chat(request: ChatRequest):
    try:
        # Get or create conversation
        conversation = conversations.get(request.conversationId, [])
        conversation.append({"role": "user", "content": request.message})

        # Generate response
        context = "\n".join([f"{msg['role']}: {msg['content']}" for msg in conversation])
        prompt = f"{request.config.get('systemPrompt', 'You are a helpful assistant.')}\n\n{context}\nAssistant:"

        response = model.generate_content(prompt)
        ai_response = response.text

        # Store response
        conversation.append({"role": "assistant", "content": ai_response})
        conversations[request.conversationId] = conversation[-20:]  # Keep last 20 messages

        return {"response": ai_response, "conversationId": request.conversationId}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Serve static files (including widget.js)
# Assumes the dist directory is in the parent directory of main.py
# Serve the entire dist directory at the root path. This will serve index.html as well.
app.mount("/", StaticFiles(directory="/home/user/SAAS-chatbot/project-bolt-sb1-dhhvestz/project/dist", html=True), name="static")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)