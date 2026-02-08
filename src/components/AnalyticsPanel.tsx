import React, { useState } from 'react';
import { useChat } from '../context/ChatContext';

const AnalyticsPanel: React.FC = () => {
  const { messages, userInfo, isEscalated } = useChat();
  const [isOpen, setIsOpen] = useState(false);

  // Calculate metrics
  const totalMessages = messages.length;
  const userMessages = messages.filter(msg => msg.sender === 'user').length;
  const botMessages = messages.filter(msg => msg.sender === 'bot').length;
  const fallbackMessages = messages.filter(msg => msg.isFallback).length;
  const escalationRate = totalMessages > 0 ? (fallbackMessages / totalMessages) * 100 : 0;

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg hover:bg-blue-600 transition-all duration-300 z-40"
        aria-label="Open analytics"
      >
        📊
      </button>
    );
  }

  return (
    <div className="fixed bottom-24 right-6 bg-white rounded-lg shadow-lg border border-gray-200 p-4 w-64 z-40">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-gray-800">Analytics</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-500 hover:text-gray-700"
          aria-label="Close analytics"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Total Messages:</span>
          <span className="font-medium text-gray-950">{totalMessages}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">User Messages:</span>
          <span className="font-medium  text-gray-950">{userMessages}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Bot Messages:</span>
          <span className="font-medium  text-gray-950">{botMessages}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Fallback Rate:</span>
          <span className="font-medium  text-gray-950">{escalationRate.toFixed(1)}%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Escalated:</span>
          <span className={`font-medium ${isEscalated ? 'text-red-600' : 'text-green-600'}`}>
            {isEscalated ? 'Yes' : 'No'}
          </span>
        </div>

        {userInfo.name && (
          <div className="pt-2 border-t border-gray-200">
            <div className="text-gray-600">Captured Info:</div>
            <div className="text-xs text-gray-500 truncate">{userInfo.name}{userInfo.email ? `, ${userInfo.email}` : ''}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsPanel;