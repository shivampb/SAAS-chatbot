import React, { useState } from 'react';
import { MessageCircle, Code, Copy, Check, Settings } from 'lucide-react';

function App() {
  const [copied, setCopied] = useState(false);
  const [config, setConfig] = useState({
    apiUrl: 'http://localhost:8000',
    primaryColor: '#3B82F6',
    position: 'bottom-right' as 'bottom-right' | 'bottom-left',
    title: 'Chat Support',
    placeholder: 'Type your message...',
    systemPrompt: 'You are a helpful customer service assistant.'
  });

  const embedCode = `<script src="${config.apiUrl}/widget.js"></script>
<script>ChatbotWidget.init(${JSON.stringify(config, null, 2)});</script>`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfigChange = (key: string, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500 rounded-lg">
              <MessageCircle className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">AI Chatbot Service</h1>
              <p className="text-gray-600">Embed powerful AI chat support into any website</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Configuration Panel */}
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-2 mb-6">
                <Settings className="text-blue-500" size={20} />
                <h2 className="text-xl font-semibold">Configuration</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    API URL
                  </label>
                  <input
                    type="text"
                    value={config.apiUrl}
                    onChange={(e) => handleConfigChange('apiUrl', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Primary Color
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={config.primaryColor}
                      onChange={(e) => handleConfigChange('primaryColor', e.target.value)}
                      className="w-12 h-10 border border-gray-300 rounded-md cursor-pointer"
                    />
                    <input
                      type="text"
                      value={config.primaryColor}
                      onChange={(e) => handleConfigChange('primaryColor', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Position
                  </label>
                  <select
                    value={config.position}
                    onChange={(e) => handleConfigChange('position', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="bottom-right">Bottom Right</option>
                    <option value="bottom-left">Bottom Left</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chat Title
                  </label>
                  <input
                    type="text"
                    value={config.title}
                    onChange={(e) => handleConfigChange('title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Input Placeholder
                  </label>
                  <input
                    type="text"
                    value={config.placeholder}
                    onChange={(e) => handleConfigChange('placeholder', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    System Prompt
                  </label>
                  <textarea
                    value={config.systemPrompt}
                    onChange={(e) => handleConfigChange('systemPrompt', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Embed Code */}
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-2 mb-6">
                <Code className="text-purple-500" size={20} />
                <h2 className="text-xl font-semibold">Embed Code</h2>
              </div>

              <p className="text-gray-600 mb-4">
                Copy and paste this code into your website to add the chatbot:
              </p>

              <div className="relative">
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{embedCode}</code>
                </pre>
                <button
                  onClick={copyToClipboard}
                  className="absolute top-3 right-3 px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm flex items-center gap-1"
                >
                  {copied ? (
                    <>
                      <Check size={14} />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      Copy
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Features */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Features</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Easy 2-line JavaScript integration
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Powered by Google Gemini AI
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Fully customizable appearance
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Mobile responsive design
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Real-time conversations
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Cross-origin support
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Live Demo */}
        <div className="mt-12 text-center">
          <p className="text-lg text-gray-600 mb-4">
            Try the chatbot in action! Click the floating button in the {config.position.replace('-', ' ')}.
          </p>
        </div>
      </div>

      {/* Demo Chatbot Widget */}
      <div 
        className={`fixed ${config.position === 'bottom-left' ? 'bottom-4 left-4' : 'bottom-4 right-4'} z-50`}
        style={{ position: 'fixed' }}
      >
        <div id="demo-chatbot"></div>
      </div>
    </div>
  );
}

export default App;