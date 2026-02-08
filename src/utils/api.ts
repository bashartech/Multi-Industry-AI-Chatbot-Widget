export interface ChatResponse {
  reply: string;
  completed: boolean;
}

export interface ChatRequest {
  message: string;
  industry: string;
  sessionId: string;
}

export const sendMessage = async (message: string, industry: string, sessionId: string) => {
  try {
    // Use environment variable for backend URL, fallback to localhost for development
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
    const response = await fetch(`${backendUrl}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        industry,
        sessionId
      }),
    });

    const result: ChatResponse = await response.json();
    return result;
  } catch (error) {
    console.error('Error sending message:', error);
    return {
      reply: 'Sorry, I encountered an error. Please try again.',
      completed: false
    };
  }
};

export interface LeadData {
  name: string;
  email: string;
  phone?: string;
  query?: string;
}

export interface LeadResponse {
  success: boolean;
  error?: string;
}

export const saveLead = async (leadData: LeadData): Promise<LeadResponse> => {
  try {
    // Use environment variable for backend URL, fallback to localhost for development
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
    // Send lead data to backend to save to Firebase
    const response = await fetch(`${backendUrl}/lead`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(leadData),
    });

    if (response.ok) {
      return {
        success: true
      };
    } else {
      return {
        success: false,
        error: 'Failed to save lead data'
      };
    }
  } catch (error) {
    console.error('Error saving lead:', error);
    return {
      success: false,
      error: 'Failed to save lead data'
    };
  }
};