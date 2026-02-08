import type { Message } from '../types/chat';

export const formatTimestamp = (date: Date | string): string => {
  const dateObj = date instanceof Date ? date : new Date(date);
  return dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const createBotMessage = (text: string, isFallback: boolean = false): Message => {
  return {
    id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    text,
    sender: 'bot',
    timestamp: new Date(),
    isFallback,
  };
};

export const createUserMessage = (text: string): Message => {
  return {
    id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    text,
    sender: 'user',
    timestamp: new Date(),
  };
};

export const groupMessagesByDate = (messages: Message[]): { [key: string]: Message[] } => {
  const grouped: { [key: string]: Message[] } = {};

  messages.forEach(message => {
    // Ensure timestamp is a Date object before calling toDateString()
    const date = message.timestamp instanceof Date ? message.timestamp : new Date(message.timestamp);
    const dateKey = date.toDateString();
    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }
    grouped[dateKey].push(message);
  });

  return grouped;
};

export const regenerateMessageIds = (messages: Message[]): Message[] => {
  return messages.map(msg => ({
    ...msg,
    id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }));
};

export const detectLinks = (text: string): string => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.replace(urlRegex, '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:underline">$1</a>');
};