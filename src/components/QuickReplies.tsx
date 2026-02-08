import React from 'react';
import { useChat } from '../context/ChatContext';

interface QuickRepliesProps {
  onSend: (text: string) => void;
}

const QuickReplies: React.FC<QuickRepliesProps> = ({ onSend }) => {
  const { config } = useChat();

  // Default quick replies if none are configured
  const defaultReplies = [
    { id: '1', text: 'What services do you offer?', industry: 'General' },
    { id: '2', text: 'How much do you charge?', industry: 'General' },
    { id: '3', text: 'Contact support', industry: 'General' },
    { id: '4', text: 'Schedule a demo', industry: 'General' },
  ];

  const quickReplies = config.quickReplies.length > 0 ? config.quickReplies : defaultReplies;

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {quickReplies.slice(0, 4).map((reply) => (
        <button
          key={reply.id}
          onClick={() => onSend(reply.text)}
          className="bg-chat-bg hover:bg-gray-200 text-chat-text text-xs px-3 py-1.5 rounded-full transition-colors duration-200 whitespace-nowrap border border-chat-border"
        >
          {reply.text}
        </button>
      ))}
    </div>
  );
};

export default QuickReplies;