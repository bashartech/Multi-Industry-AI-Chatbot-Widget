import React, { useState } from 'react';

interface MessageInputProps {
  onSend: (text: string) => void;
  disabled: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSend, disabled }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !disabled) {
      onSend(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex text-gray-950 gap-2">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Type your message..."
        disabled={disabled}
        className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-chat-primary focus:border-transparent bg-white text-chat-text placeholder-chat-placeholder"
        aria-label="Type your message"
      />
      <button
        type="submit"
        disabled={disabled || !inputValue.trim()}
        className={`bg-chat-primary text-white rounded-full w-10 h-10 flex items-center justify-center ${
          disabled || !inputValue.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:bg-opacity-90'
        }`}
        aria-label="Send message"
      >
        <p>=</p>
        
      </button>
    </form>
  );
};

export default MessageInput;