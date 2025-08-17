import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration for embedding
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key']
}));

app.use(express.json());
app.use(express.static(path.join(__dirname, '../dist')));

// Store active conversations (in production, use a proper database)
const conversations = new Map();

// Initialize Gemini AI (you'll need to set your API key)
let genAI;
try {
  // Replace with your actual Gemini API key
  const API_KEY = process.env.GEMINI_API_KEY || 'your-gemini-api-key-here';
  genAI = new GoogleGenerativeAI(API_KEY);
} catch (error) {
  console.warn('Gemini AI not initialized - using mock responses');
}

// Mock AI response for demo purposes
const getMockResponse = (message) => {
  const responses = [
    "Hello! I'm here to help you. How can I assist you today?",
    "That's a great question! Let me help you with that.",
    "I understand your concern. Here's what I can suggest...",
    "Thanks for reaching out! I'm happy to help you with this.",
    "That's an interesting point. Let me provide some guidance on that."
  ];
  return responses[Math.floor(Math.random() * responses.length)];
};

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, conversationId, config } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Get or create conversation
    let conversation = conversations.get(conversationId) || [];
    conversation.push({ role: 'user', content: message, timestamp: new Date() });

    let aiResponse;

    // Try to use Gemini AI
    if (genAI) {
      try {
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        
        // Build context from conversation history
        const context = conversation.map(msg => 
          `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
        ).join('\n');
        
        const prompt = `${config?.systemPrompt || 'You are a helpful customer service assistant.'}\n\nConversation:\n${context}\n\nAssistant:`;
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        aiResponse = response.text();
      } catch (error) {
        console.error('Gemini API error:', error);
        aiResponse = getMockResponse(message);
      }
    } else {
      // Use mock response
      aiResponse = getMockResponse(message);
    }

    // Add AI response to conversation
    conversation.push({ 
      role: 'assistant', 
      content: aiResponse, 
      timestamp: new Date() 
    });
    
    // Store conversation (limit to last 20 messages)
    conversations.set(conversationId, conversation.slice(-20));

    res.json({
      response: aiResponse,
      conversationId,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ 
      error: 'Sorry, I encountered an error. Please try again.' 
    });
  }
});

// Get conversation history
app.get('/api/conversation/:id', (req, res) => {
  const conversation = conversations.get(req.params.id) || [];
  res.json({ conversation });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Serve the chatbot widget
app.get('/widget.js', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/widget.js'));
});

app.listen(PORT, () => {
  console.log(`🤖 Chatbot service running on port ${PORT}`);
  console.log(`📦 Widget available at: http://localhost:${PORT}/widget.js`);
  console.log(`🔗 Embed code:`);
  console.log(`<script src="http://localhost:${PORT}/widget.js"></script>`);
  console.log(`<script>ChatbotWidget.init({ apiUrl: 'http://localhost:${PORT}' });</script>`);
});