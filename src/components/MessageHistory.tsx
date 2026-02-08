import React, { useRef, useEffect } from 'react';
import { useChat } from '../context/ChatContext';
import MessageBubble from './MessageBubble';
import { formatTimestamp } from '../utils/messages';

const MessageHistory: React.FC = () => {
  const { messages } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Group messages by date for better organization
  const groupMessagesByDate = (msgs: typeof messages) => {
    const groups: { [key: string]: typeof messages } = {};

    msgs.forEach(msg => {
      // Ensure timestamp is a Date object before calling toDateString()
      const date = msg.timestamp instanceof Date ? msg.timestamp : new Date(msg.timestamp);
      const dateKey = date.toDateString();
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(msg);
    });

    return groups;
  };

  const groupedMessages = groupMessagesByDate(messages);

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-chat-bg">
      {messages.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No messages yet. Start the conversation!</p>
        </div>
      ) : (
        Object.entries(groupedMessages).map(([date, dateMessages]) => (
          <div key={date} className="mb-4">
            <div className="text-center text-xs text-gray-500 my-3">
              {new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </div>
            <div className="space-y-3">
              {dateMessages.map((message) => (
                <MessageBubble
                  key={message.id}
                  text={message.text}
                  sender={message.sender}
                  timestamp={formatTimestamp(message.timestamp)}
                  isFallback={message.isFallback}
                />
              ))}
            </div>
          </div>
        ))
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageHistory;