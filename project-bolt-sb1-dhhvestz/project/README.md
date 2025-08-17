# AI Chatbot Service

A service-based AI chatbot that can be easily embedded into any website with just 2 lines of JavaScript.

## Features

- 🤖 Powered by Google Gemini AI
- 🚀 Easy 2-line JavaScript integration
- 🎨 Fully customizable appearance
- 📱 Mobile responsive design
- 💬 Real-time conversations
- 🌐 Cross-origin support
- ⚙️ Configurable system prompts

## Quick Start

### 1. Set up your Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy your API key

### 2. Configure the service

Create a `.env` file:

```bash
GEMINI_API_KEY=your-gemini-api-key-here
PORT=3001
```

### 3. Run the service

```bash
npm install
npm run dev
```

### 4. Embed in any website

Add these 2 lines to your website:

```html
<script src="http://localhost:3001/widget.js"></script>
<script>
ChatbotWidget.init({
  apiUrl: 'http://localhost:3001',
  primaryColor: '#3B82F6',
  position: 'bottom-right',
  title: 'Chat Support',
  placeholder: 'How can I help you?',
  systemPrompt: 'You are a helpful customer service assistant.'
});
</script>
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `apiUrl` | string | Required | URL of your chatbot service |
| `primaryColor` | string | `#3B82F6` | Primary color for the chat widget |
| `position` | string | `bottom-right` | Position of the chat button (`bottom-right` or `bottom-left`) |
| `title` | string | `Chat Support` | Title shown in the chat header |
| `placeholder` | string | `Type your message...` | Placeholder text for the input field |
| `systemPrompt` | string | Default prompt | System prompt to guide the AI's behavior |

## FastAPI Migration

To migrate the backend to FastAPI (Python):

1. Install dependencies:
```bash
pip install fastapi uvicorn google-generativeai python-dotenv
```

2. Create `main.py`:
```python
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai
import os
from dotenv import load_dotenv

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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

3. Run with:
```bash
uvicorn main:app --reload
```

## Deployment

### Production Deployment

1. Build the widget:
```bash
npm run build
```

2. Deploy the backend service to your preferred platform (Heroku, AWS, etc.)

3. Update the `apiUrl` in your embed code to point to your production API

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["npm", "run", "dev:server"]
```

## API Endpoints

- `POST /api/chat` - Send a message and get AI response
- `GET /api/conversation/:id` - Get conversation history
- `GET /api/health` - Health check
- `GET /widget.js` - Chatbot widget script

## License

MIT License