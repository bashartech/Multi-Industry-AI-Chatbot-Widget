# AI Automation & Chatbot

## Overview
This is a multi-industry AI chatbot widget that can be embedded on any website. It handles user interactions, lead capture, and basic automation workflows.

## Features
- Responsive chat widget that can be embedded via a `<script>` tag on any website
- Industry-specific conversation flows (Hotel, Real Estate, Healthcare)
- Lead capture functionality with name, email, phone, and query
- Human escalation when AI cannot answer
- Quick reply buttons for common questions
- Support for multiple concurrent users

## Installation

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager

### Frontend Setup
1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Backend Setup
1. Navigate to the backend directory:
```bash
cd backend
```

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

3. Set up environment variables:
Create a `.env` file in the backend directory with:
```
GEMINI_API_KEY=your_google_gemini_api_key
```

4. Run the backend server:
```bash
python main.py
```

The backend will be available at `http://localhost:8000`

## Embedding on Your Website

To embed the chatbot on any website, add the following script to your HTML:

```html
<script src="path/to/embed-script.js"></script>
```

You can customize the chatbot by setting the `AIBotConfig` object before including the script:

```html
<script>
  window.AIBotConfig = {
    backendUrl: 'https://your-deployed-backend-url.com',
    defaultIndustry: 'hotel',
    botName: 'Your Bot Name',
    welcomeMessage: 'Custom welcome message'
  };
</script>
<script src="path/to/embed-script.js"></script>
```

## Building for Production

### Frontend
```bash
npm run build
```

### Backend
Deploy the FastAPI application using your preferred platform (Heroku, AWS, Google Cloud, etc.)

## Project Structure
- `src/components/` - React components for the chatbot UI
- `src/context/` - React context for state management
- `src/utils/` - Utility functions for API calls and message handling
- `src/types/` - TypeScript type definitions
- `src/config/` - Configuration files
- `backend/` - FastAPI backend implementation
- `dist/` - Distribution files including embed script

## Technologies Used
- Frontend: React, TypeScript, Tailwind CSS, Vite
- Backend: FastAPI, Python
- AI: Google Gemini Pro
- Database: Firebase Firestore
- State Management: React Context API

## Evaluation Criteria
- Code structure and readability
- Proper use of React and API integrations
- Chatbot functionality completeness (responses, lead capture, escalation)
- UI/UX quality (clean, responsive, user-friendly)
- Git commit hygiene and documentation

## Deployment
- Frontend can be deployed to Netlify, Vercel, or similar platforms
- Backend can be deployed to Heroku, Google Cloud Run, or similar platforms
- Firebase project required for lead storage