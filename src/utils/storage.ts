const CHAT_STORAGE_KEY = 'ai-chatbot-session';
const USER_INFO_KEY = 'ai-chatbot-user-info';

export const getSessionData = () => {
  try {
    const stored = localStorage.getItem(CHAT_STORAGE_KEY);
    return stored ? JSON.parse(stored) : { messages: [] };
  } catch (error) {
    console.error('Error retrieving session data:', error);
    return { messages: [] };
  }
};

export const saveSessionData = (data: any) => {
  try {
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving session data:', error);
  }
};

export const getUserInfo = () => {
  try {
    const stored = localStorage.getItem(USER_INFO_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Error retrieving user info:', error);
    return {};
  }
};

export const saveUserInfo = (userInfo: any) => {
  try {
    localStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo));
  } catch (error) {
    console.error('Error saving user info:', error);
  }
};

export const clearSession = () => {
  try {
    localStorage.removeItem(CHAT_STORAGE_KEY);
    localStorage.removeItem(USER_INFO_KEY);
  } catch (error) {
    console.error('Error clearing session:', error);
  }
};