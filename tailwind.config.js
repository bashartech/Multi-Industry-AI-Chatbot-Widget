/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'chat-primary': '#107C10',      // Green for bot messages and primary actions
        'chat-secondary': '#0078D4',    // Blue for user messages and secondary actions
        'chat-bg': '#F5F5F5',          // Light gray for chat background
        'chat-user-bubble': '#DCF8C6', // Light green for user message bubbles
        'chat-bot-bubble': '#FFFFFF',  // White for bot message bubbles
        'chat-input': '#FFFFFF',       // White for input area
        'chat-border': '#E0E0E0',      // Light gray for borders
        'chat-text': '#333333',        // Dark gray for better text contrast
        'chat-placeholder': '#9CA3AF', // Gray for placeholder text
      },
      boxShadow: {
        'chat-widget': '0 4px 12px rgba(0, 0, 0, 0.1)',
        'chat-bubble': '0 1px 2px rgba(0, 0, 0, 0.1)',
      },
      maxWidth: {
        'chat': '400px',               // Max width for chat window
      },
      height: {
        'chat': '500px',              // Standard height for chat window
        'chat-min': '300px',          // Minimum height for chat window
      }
    },
  },
  plugins: [],
}