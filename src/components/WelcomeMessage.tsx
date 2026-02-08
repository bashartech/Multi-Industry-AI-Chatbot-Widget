import React from 'react';
import { useChat } from '../context/ChatContext';

const WelcomeMessage: React.FC = () => {
  const { config } = useChat();

  return (
    <div className="text-center py-8">
      <div className="flex justify-center mb-4">
        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{config.botName}</h3>
      <p className="text-gray-600 text-sm">{config.welcomeMessage}</p>
      <div className="mt-4 inline-flex animate-pulse">
        <div className="h-2 w-2 bg-chat-primary rounded-full mx-1"></div>
        <div className="h-2 w-2 bg-chat-primary rounded-full mx-1"></div>
        <div className="h-2 w-2 bg-chat-primary rounded-full mx-1"></div>
      </div>
    </div>
  );
};

export default WelcomeMessage;