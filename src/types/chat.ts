export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date | string;
  isFallback?: boolean;
}

export interface UserInfo {
  name?: string;
  email?: string;
  phone?: string;
  query?: string;
}

export interface QuickReplyOption {
  id: string;
  text: string;
  industry: string;
}

export interface ChatConfig {
  botName: string;
  welcomeMessage: string;
  industries: string[];
  quickReplies: QuickReplyOption[];
  fallbackMessage: string;
  selectedIndustry?: string;
}