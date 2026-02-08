import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '../context/ChatContext';
import { createBotMessage, createUserMessage } from '../utils/messages';
import ChatWindow from './ChatWindow';
import MessageInput from './MessageInput';
import QuickReplies from './QuickReplies';
import WelcomeMessage from './WelcomeMessage';
import LeadCaptureForm from './LeadCaptureForm';
import { sendMessage } from '../utils/api';

const ChatWidget: React.FC = () => {
  const {
    messages,
    isLoading,
    isEscalated,
    config,
    addMessage,
    setLoading,
    setEscalated,
    resetChat
  } = useChat();

  const [showWidget, setShowWidget] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const sessionId = useState<string>(() => {
    // Generate a unique session ID or retrieve from localStorage
    return localStorage.getItem('chat_session_id') || Date.now().toString();
  })[0]; // Extract just the value, not the setter
  const selectedIndustry = 'hotel'; // Static value, no state needed

  // Store session ID in localStorage
  useEffect(() => {
    localStorage.setItem('chat_session_id', sessionId);
  }, [sessionId]);

  // Config is initialized in the context, no need to initialize here

  // Show welcome message when widget opens
  const hasShownWelcomeMessage = useRef(false);
  
  useEffect(() => {
    if (showWidget && messages.length === 0 && !hasShownWelcomeMessage.current) {
      const timer = setTimeout(() => {
        addMessage(createBotMessage(config.welcomeMessage));
        hasShownWelcomeMessage.current = true; // Mark that welcome message has been shown
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [showWidget, messages.length, config.welcomeMessage]);

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



  const handleResetChat = () => {
    resetChat();
    // Add the welcome message after reset
    setTimeout(() => {
      addMessage(createBotMessage(config.welcomeMessage));
    }, 100);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!showWidget ? (
        <button
          onClick={() => {
            setShowWidget(true);
            // Reset the chat when opening if you want fresh conversations
            // Uncomment the next line if you want to clear messages on open
            // resetChat(); 
          }}
          className="bg-chat-primary text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-opacity-90 transition-all duration-300"
          aria-label="Open chat"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </button>
      ) : (
        <div className="bg-white rounded-lg shadow-chat-widget border border-chat-border overflow-hidden max-w-chat w-full flex flex-col h-chat">
          {/* Header */}
          <div className="bg-chat-primary text-white p-4 flex justify-between items-center">
            <div>
              <h3 className="font-semibold">{config.botName}</h3>
              <p className="text-xs opacity-80">Online now</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleResetChat}
                className="text-white hover:text-gray-300 focus:outline-none"
                aria-label="Reset chat"
              >
                🔄
              </button>
              <button
                onClick={() => {
                  setShowWidget(false);
                  // Don't reset chat when closing - keep conversation history
                }}
                className="text-white hover:text-gray-300 focus:outline-none"
                aria-label="Close chat"
              >
                ×
              </button>
            </div>
          </div>

          {/* Chat Content */}
          <div className="flex-1 overflow-y-auto text-gray-950 p-4 bg-chat-bg">
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
          {(messages.length > 0 || (messages.length === 0 && showWidget)) && !isEscalated && !showLeadForm && (
            <div className="border-t border-chat-border bg-chat-input p-3">
              <MessageInput onSend={handleSendMessage} disabled={isLoading} />

              {messages.length === 0 && (
                <QuickReplies onSend={handleSendMessage} />
              )}
              {messages.length === 1 && (
                <QuickReplies onSend={handleSendMessage} />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatWidget;

