import React, { useState, useEffect } from 'react';
import { useChat } from '../context/ChatContext';
import IndustrySelector from './IndustrySelector';

const SettingsPanel: React.FC = () => {
  const { resetChat, config, setConfig } = useChat();
  const [isOpen, setIsOpen] = useState(false);
  const [botName, setBotName] = useState(config.botName);
  const [welcomeMessage, setWelcomeMessage] = useState(config.welcomeMessage);

  // Update local state when config changes
  useEffect(() => {
    setBotName(config.botName);
    setWelcomeMessage(config.welcomeMessage);
  }, [config]);

  const handleSaveSettings = () => {
    // Update the chat config with new settings
    setConfig({
      ...config,
      botName,
      welcomeMessage
    });
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-36 right-6 text-white bg-purple-500 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg hover:bg-purple-600 transition-all duration-300 z-40"
        aria-label="Open settings"
      >
        ⚙️
      </button>
    );
  }

  return (
    <div className="fixed bottom-36 right-6 bg-white rounded-lg shadow-lg border text-black border-gray-200 p-4 w-72 z-40">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-800">Settings</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-500 hover:text-gray-700"
          aria-label="Close settings"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="botName" className="block text-sm font-medium text-gray-700 mb-1">
            Bot Name
          </label>
          <input
            type="text"
            id="botName"
            value={botName}
            onChange={(e) => setBotName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-chat-primary"
            placeholder="Enter bot name"
          />
        </div>

        <div>
          <label htmlFor="welcomeMessage" className="block text-sm font-medium text-gray-700 mb-1">
            Welcome Message
          </label>
          <textarea
            id="welcomeMessage"
            value={welcomeMessage}
            onChange={(e) => setWelcomeMessage(e.target.value)}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-chat-primary"
            placeholder="Enter welcome message"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Industry
          </label>
          <IndustrySelector />
        </div>

        <div className="flex space-x-2 pt-2">
          <button
            onClick={resetChat}
            className="flex-1 px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-chat-primary"
          >
            Reset Chat
          </button>
          <button
            onClick={handleSaveSettings}
            className="flex-1 px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-chat-primary hover:bg-opacity-90 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-chat-primary"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;