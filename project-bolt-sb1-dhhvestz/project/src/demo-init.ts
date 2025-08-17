import { ChatbotWidget } from './components/ChatbotWidget';
import React from 'react';
import { createRoot } from 'react-dom/client';

// Initialize demo chatbot after DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const demoContainer = document.getElementById('demo-chatbot');
  if (demoContainer) {
    const root = createRoot(demoContainer);
    root.render(React.createElement(ChatbotWidget, {
      config: {
        apiUrl: 'http://localhost:3001',
        primaryColor: '#3B82F6',
        position: 'bottom-right',
        title: 'Demo Chat',
        placeholder: 'Try me out!',
        systemPrompt: 'You are a helpful demo assistant showcasing the chatbot capabilities.'
      }
    }));
  }
});