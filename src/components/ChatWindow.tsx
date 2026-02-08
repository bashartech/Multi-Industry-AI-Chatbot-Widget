import React from 'react';
import MessageHistory from './MessageHistory';

const ChatWindow: React.FC = () => {
  return (
    <div className="max-h-80 overflow-y-auto pr-2">
      <MessageHistory />
    </div>
  );
};

export default ChatWindow;