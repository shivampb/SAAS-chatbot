import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageCircle, X, Minimize2 } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatbotConfig {
  apiUrl: string;
  primaryColor?: string;
  position?: 'bottom-right' | 'bottom-left';
  title?: string;
  placeholder?: string;
  systemPrompt?: string;
}

interface ChatbotWidgetProps {
  config: ChatbotConfig;
}

export const ChatbotWidget: React.FC<ChatbotWidgetProps> = ({ config }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId] = useState(() => 'conv_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9));
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: content.trim(),
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch(`${config.apiUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: content.trim(),
          conversationId,
          config: {
            systemPrompt: config.systemPrompt
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I'm having trouble connecting right now. Please try again.",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const primaryColor = config.primaryColor || '#3B82F6';
  const position = config.position || 'bottom-right';
  const title = config.title || 'Chat Support';
  const placeholder = config.placeholder || 'Type your message...';

  const positionClass = position === 'bottom-left' ? 'bottom-4 left-4' : 'bottom-4 right-4';

  return (
    <div className={`fixed ${positionClass} z-50 font-sans`}>
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-80 h-96 bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col animate-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div 
            className="p-4 rounded-t-lg text-white flex items-center justify-between"
            style={{ backgroundColor: primaryColor }}
          >
            <h3 className="font-semibold text-sm">{title}</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-black/10 p-1 rounded transition-colors"
              >
                <Minimize2 size={16} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 text-sm mt-8">
                <MessageCircle className="mx-auto mb-2 text-gray-400" size={32} />
                <p>Hi! How can I help you today?</p>
              </div>
            )}
            
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-3 py-2 rounded-2xl text-sm ${
                    message.isUser
                      ? 'text-white rounded-br-sm'
                      : 'bg-white text-gray-800 rounded-bl-sm shadow-sm border'
                  }`}
                  style={message.isUser ? { backgroundColor: primaryColor } : {}}
                >
                  {message.content}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-800 px-3 py-2 rounded-2xl rounded-bl-sm text-sm shadow-sm border">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200 bg-white rounded-b-lg">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={placeholder}
                disabled={isLoading}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-opacity-50 text-sm disabled:opacity-50"
                style={{ focusRingColor: primaryColor }}
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className="p-2 text-white rounded-full hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: primaryColor }}
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 text-white rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105 flex items-center justify-center"
        style={{ backgroundColor: primaryColor }}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
    </div>
  );
};