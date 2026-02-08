import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '../context/ChatContext';
import { createBotMessage, createUserMessage } from '../utils/messages';
import ChatWindow from './ChatWindow';
import MessageInput from './MessageInput';
import QuickReplies from './QuickReplies';
import WelcomeMessage from './WelcomeMessage';
import LeadCaptureForm from './LeadCaptureForm';
import { sendMessage } from '../utils/api';

const EmbeddedChatWidget: React.FC = () => {
  const {
    messages,
    isLoading,
    isEscalated,
    config,
    addMessage,
    setLoading,
    setEscalated,
  } = useChat();

  const [showLeadForm, setShowLeadForm] = useState(false);
  // const [hasRequestedInfo, setHasRequestedInfo] = useState(false);
  const [sessionId] = useState<string>(() => {
    // Generate a unique session ID or retrieve from localStorage
    return localStorage.getItem('chat_session_id') || Date.now().toString();
  });
  const [selectedIndustry] = useState<string>(() => {
    // Get industry from URL params or use default
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('industry') || 'hotel';
  });

  const hasShownWelcomeMessage = useRef(false);

  // Store session ID in localStorage
  useEffect(() => {
    localStorage.setItem('chat_session_id', sessionId);
  }, [sessionId]);

  // Config is initialized in the context, no need to initialize here

  // Show welcome message when widget opens
  useEffect(() => {
    if (messages.length === 0 && !hasShownWelcomeMessage.current) {
      const timer = setTimeout(() => {
        addMessage(createBotMessage(config.welcomeMessage));
        hasShownWelcomeMessage.current = true; // Mark that welcome message has been shown
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [messages.length, config.welcomeMessage]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    // Add user message
    const userMsg = createUserMessage(text);
    addMessage(userMsg);

    setLoading(true);

    try {
      // Call the backend API
      const response = await sendMessage(text, selectedIndustry, sessionId);

      // Add bot response
      addMessage(createBotMessage(response.reply, response.completed));

      // If the conversation is completed, show lead form
      if (response.completed) {
        setShowLeadForm(true);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error sending message:', error);
      // Don't add error message if it's already present to avoid infinite loop
      const lastMessage = messages[messages.length - 1];
      if (!lastMessage || !lastMessage.text.includes('Sorry, I encountered an error')) {
        addMessage(createBotMessage('Sorry, I encountered an error. Please try again.', true));
      }
      setLoading(false);
    }
  };

  const handleEscalate = () => {
    setEscalated(true);
    setShowLeadForm(true);
    addMessage(createBotMessage('Connecting you with our team...', true));
  };

  const handleLeadFormClose = () => {
    setShowLeadForm(false);
  };

  const handleLeadFormSuccess = () => {
    // No longer tracking hasRequestedInfo
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-chat-primary text-white p-4 flex justify-between items-center">
        <div>
          <h3 className="font-semibold">{config.botName}</h3>
          <p className="text-xs opacity-80">Online now</p>
        </div>
        <button
          onClick={() => window.parent.postMessage({ type: 'CLOSE_CHAT_WIDGET' }, '*')}
          className="text-white hover:text-gray-200 focus:outline-none"
          aria-label="Close chat"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {/* Chat Content */}
      <div className="flex-1 overflow-y-auto p-4 bg-chat-bg">
        {messages.length === 0 ? (
          <WelcomeMessage />
        ) : (
          <>
            <ChatWindow />

            {showLeadForm && (
              <LeadCaptureForm
                onClose={handleLeadFormClose}
                onSuccess={handleLeadFormSuccess}
              />
            )}

            {!isEscalated && messages.length > 0 && !showLeadForm && (
              <button
                onClick={handleEscalate}
                className="mt-3 text-xs text-red-600 hover:text-red-800 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Talk to Admin
              </button>
            )}
          </>
        )}
      </div>

      {/* Input Area */}
      {messages.length > 0 && !isEscalated && !showLeadForm && (
        <div className="border-t border-chat-border bg-chat-input p-3">
          <MessageInput onSend={handleSendMessage} disabled={isLoading} />

          {messages.length === 1 && (
            <QuickReplies onSend={handleSendMessage} />
          )}
        </div>
      )}
    </div>
  );
};

export default EmbeddedChatWidget;