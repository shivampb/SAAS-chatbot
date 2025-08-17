import React from 'react';
import { createRoot } from 'react-dom/client';
import { ChatbotWidget } from './components/ChatbotWidget';
import './index.css';

// Global widget interface
declare global {
  interface Window {
    ChatbotWidget: {
      init: (config: any) => void;
      destroy: () => void;
    };
  }
}

class ChatbotWidgetController {
  private root: any = null;
  private container: HTMLElement | null = null;

  init(config: any) {
    if (this.container) {
      this.destroy();
    }

    // Create container
    this.container = document.createElement('div');
    this.container.id = 'chatbot-widget-root';
    document.body.appendChild(this.container);

    // Create React root and render
    this.root = createRoot(this.container);
    this.root.render(React.createElement(ChatbotWidget, { config }));
  }

  destroy() {
    if (this.root) {
      this.root.unmount();
      this.root = null;
    }
    if (this.container) {
      document.body.removeChild(this.container);
      this.container = null;
    }
  }
}

// Initialize global widget controller
const widgetController = new ChatbotWidgetController();

// Expose global API
window.ChatbotWidget = {
  init: (config) => widgetController.init(config),
  destroy: () => widgetController.destroy()
};

// Auto-initialize if config is provided
const script = document.currentScript as HTMLScriptElement;
if (script && script.dataset.config) {
  try {
    const config = JSON.parse(script.dataset.config);
    widgetController.init(config);
  } catch (error) {
    console.error('Invalid ChatbotWidget configuration:', error);
  }
}