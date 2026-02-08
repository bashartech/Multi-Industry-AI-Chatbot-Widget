import type { ChatConfig } from '../types/chat';

export const defaultChatConfig: ChatConfig = {
  botName: 'AI Assistant',
  welcomeMessage: "Hi, I'm your AI assistant. How can I help you today?",
  industries: ['hotel', 'real_estate', 'healthcare'], // Match backend industries
  quickReplies: [
    { id: 'hotel-1', text: 'Book a room', industry: 'hotel' },
    { id: 'hotel-2', text: 'Check availability', industry: 'hotel' },
    { id: 'real-estate-1', text: 'Buy property', industry: 'real_estate' },
    { id: 'real-estate-2', text: 'Rent property', industry: 'real_estate' },
    { id: 'healthcare-1', text: 'Book appointment', industry: 'healthcare' },
    { id: 'healthcare-2', text: 'Medical consultation', industry: 'healthcare' },
    { id: 'general-1', text: 'What services do you offer?', industry: 'hotel' },
    { id: 'general-2', text: 'How much do you charge?', industry: 'hotel' },
    { id: 'general-3', text: 'Contact support', industry: 'hotel' },
    { id: 'general-4', text: 'Schedule a demo', industry: 'hotel' },
  ],
  fallbackMessage: "I'm not sure about that, but we will notify our team to get back to you",
  selectedIndustry: 'hotel',
};

export const getIndustryQuickReplies = (industry: string) => {
  return defaultChatConfig.quickReplies.filter(reply =>
    reply.industry === industry || reply.industry === 'hotel' // Use hotel as general fallback
  );
};