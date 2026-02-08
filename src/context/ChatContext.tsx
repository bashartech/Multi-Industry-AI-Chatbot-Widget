import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Message, UserInfo, ChatConfig } from '../types/chat';
import { getSessionData, saveSessionData, getUserInfo, saveUserInfo, clearSession } from '../utils/storage';
import { defaultChatConfig } from '../config/chatConfig';

interface ChatState {
  messages: Message[];
  userInfo: UserInfo;
  isLoading: boolean;
  isEscalated: boolean;
  config: ChatConfig;
  isInitialized: boolean;
}

type ChatAction =
  | { type: 'ADD_MESSAGE'; payload: Message }
  | { type: 'SET_USER_INFO'; payload: UserInfo }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ESCALATED'; payload: boolean }
  | { type: 'SET_CONFIG'; payload: ChatConfig }
  | { type: 'CLEAR_MESSAGES' }
  | { type: 'SET_INITIALIZED'; payload: boolean }
  | { type: 'UPDATE_USER_INFO_FROM_STORAGE'; payload: UserInfo };

const initialState: ChatState = {
  messages: [],
  userInfo: {},
  isLoading: false,
  isEscalated: false,
  config: (() => {
    // Try to load config from localStorage, fall back to default if not available
    try {
      const savedConfig = localStorage.getItem('chat_config');
      return savedConfig ? JSON.parse(savedConfig) : defaultChatConfig;
    } catch (e) {
      return defaultChatConfig;
    }
  })(),
  isInitialized: false,
};

const chatReducer = (state: ChatState, action: ChatAction): ChatState => {
  switch (action.type) {
    case 'ADD_MESSAGE':
      const newState = {
        ...state,
        messages: [...state.messages, action.payload],
      };
      saveSessionData({ messages: newState.messages });
      return newState;
    case 'SET_USER_INFO':
      const updatedUserInfo = { ...state.userInfo, ...action.payload };
      saveUserInfo(updatedUserInfo);
      return {
        ...state,
        userInfo: updatedUserInfo,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'SET_ESCALATED':
      return {
        ...state,
        isEscalated: action.payload,
      };
    case 'SET_CONFIG':
      const newConfig = { ...state.config, ...action.payload };
      // Save config to localStorage
      localStorage.setItem('chat_config', JSON.stringify(newConfig));
      return {
        ...state,
        config: newConfig,
      };
    case 'CLEAR_MESSAGES':
      saveSessionData({ messages: [] });
      return {
        ...state,
        messages: [],
      };
    case 'SET_INITIALIZED':
      return {
        ...state,
        isInitialized: action.payload,
      };
    case 'UPDATE_USER_INFO_FROM_STORAGE':
      return {
        ...state,
        userInfo: { ...state.userInfo, ...action.payload },
      };
    default:
      return state;
  }
};

interface ChatContextType extends ChatState {
  addMessage: (message: Message) => void;
  setUserInfo: (userInfo: UserInfo) => void;
  setLoading: (isLoading: boolean) => void;
  setEscalated: (isEscalated: boolean) => void;
  setConfig: (config: ChatConfig) => void;
  clearMessages: () => void;
  initializeChat: () => void;
  resetChat: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  // Initialize chat from storage
  useEffect(() => {
    const initChat = async () => {
      // Don't load previous messages to start fresh each time
      // Only load user info from storage
      const userInfo = getUserInfo();
      if (Object.keys(userInfo).length > 0) {
        dispatch({ type: 'UPDATE_USER_INFO_FROM_STORAGE', payload: userInfo });
      }

      dispatch({ type: 'SET_INITIALIZED', payload: true });
    };

    initChat();
  }, []);

  const initializeChat = () => {
    dispatch({ type: 'SET_INITIALIZED', payload: true });
  };

  const resetChat = () => {
    dispatch({ type: 'CLEAR_MESSAGES' });
    dispatch({ type: 'SET_ESCALATED', payload: false });
    clearSession();
  };

  const value = {
    ...state,
    addMessage: (message: Message) => dispatch({ type: 'ADD_MESSAGE', payload: message }),
    setUserInfo: (userInfo: UserInfo) => dispatch({ type: 'SET_USER_INFO', payload: userInfo }),
    setLoading: (isLoading: boolean) => dispatch({ type: 'SET_LOADING', payload: isLoading }),
    setEscalated: (isEscalated: boolean) => dispatch({ type: 'SET_ESCALATED', payload: isEscalated }),
    setConfig: (config: ChatConfig) => dispatch({ type: 'SET_CONFIG', payload: config }),
    clearMessages: () => dispatch({ type: 'CLEAR_MESSAGES' }),
    initializeChat,
    resetChat,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};