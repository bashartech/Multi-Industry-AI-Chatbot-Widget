import React from 'react';
import ReactMarkdown from 'react-markdown';

interface MessageBubbleProps {
  text: string;
  sender: 'user' | 'bot';
  timestamp: string;
  isFallback?: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ text, sender, timestamp, isFallback }) => {
  const isUser = sender === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg shadow-chat-bubble ${
          isUser
            ? 'bg-chat-user-bubble text-chat-text rounded-br-none'
            : 'bg-chat-bot-bubble text-chat-text rounded-bl-none'
        } ${isFallback ? 'border-l-4 border-yellow-500' : ''}`}
      >
        <div className="text-sm prose prose-sm max-w-none">
          <ReactMarkdown>{text}</ReactMarkdown>
        </div>
        <div className={`text-xs mt-1 ${isUser ? 'text-right text-gray-500' : 'text-left text-gray-500'}`}>
          {timestamp}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;