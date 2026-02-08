import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChatProvider } from './context/ChatContext';
import EmbeddedChatWidget from './components/EmbeddedChatWidget';

// Render the embedded chat widget
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ChatProvider>
      <EmbeddedChatWidget />
    </ChatProvider>
  </React.StrictMode>,
);